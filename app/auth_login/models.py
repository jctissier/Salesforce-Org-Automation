from simple_salesforce import Salesforce, SalesforceLogin, SalesforceAuthenticationFailed
import requests



"""Login Method"""


def login_attempt(username, password, token):
    """
    Login instance to a Salesforce Sandbox
    :param username, password, token: required fields
    :return: status(200=OK, 401=Error), simple_salesforce object, current session id, sandbox instance
    """

    try:
        sf = None
        session_id = None
        instance = None

        sf = Salesforce(username=username, password=password, security_token=token, sandbox=True)
        session_id, instance = SalesforceLogin(username=username, password=password, security_token=token, sandbox=True)
        print(instance)
    except SalesforceAuthenticationFailed as e:
        print(e)
        return 401, sf, session_id, instance

    print(sf, session_id, instance)

    return 200, sf, session_id, instance


"""Dashboard Methods (Tab 1)"""


def get_metadata(link, sf, session_id, instance):
    """
    Retrieve particular metadata about a Salesforce SObject
    :param link: link to retrieve metadata in org
    :return: content of the response (metadata)
    """

    response = requests.get("https://" + instance + link,
                            headers=sf.headers, cookies={'sid': session_id})

    json_data = response.json()

    # pprint(json_data)

    # get_fields.find_components(json_data)


    # get_fields.make_custom_objects_fields_list(json_data)                 # Use this to get all the fields from a custom object (different for ApexPages)

    return json_data


def dashboard_custom_objects(sf, session_id, instance):
    print(sf, instance, session_id)
    json_data = get_metadata("/services/data/v39.0/tooling/query/?q=Select+id,DeveloperName+from+CustomObject",
                             sf, session_id, instance)
    size = len(json_data['records'])

    names = []
    ids = []
    for i in range(size):
        ids.append([json_data['records'][i]['Id']])
        names.append(json_data['records'][i]['DeveloperName'] + "__c")

    print(names, ids, size)

    return [names, ids], size


def run_query(sf, soql):
    """
    Retrieves data about particular SObject based on _query_mapping
    :return: zip value of name, id and url of SObject
    """

    query_test = sf.query(soql)
    # pprint(query_test)                                  # Pretty prints the entire query result (ordered dict)

    names = []
    ids =[]
    urls = []

    # Wrap in a list to be able to index access
    items = list(query_test.items())
    size = int(items[0][1])                               # Total Size of the query
    for i in range(size):
        names.append(items[2][1][i]['Name'])
        ids.append(items[2][1][i]['Id'])
        urls.append(items[2][1][i]['attributes']['url'])

    return [names, ids, urls], size


def dashboard_sobject_query(sf, sobject):
    data, size = run_query(sf, 'SELECT Id, Name FROM %s' % sobject)
    print("\n")
    print('SELECT Id, Name FROM %s' % sobject)
    print(size)
    for d in data:
        print(d)

    return data, size


"""Dashboard Methods, generate Package.xml (Tab 2)"""


def sobjects_mapping(data, encoded):
    custom_objects = [data[i].replace("Custom_Object_", "") for i in range(len(data)) if "Custom_Object_" in data[i]]
    pages = [data[i].replace("Apex_Page_", "") for i in range(len(data)) if "Apex_Page_" in data[i]]
    components = [data[i].replace("Apex_Component_", "") for i in range(len(data)) if "Apex_Component_" in data[i]]
    classes = [data[i].replace("Apex_Class_", "") for i in range(len(data)) if "Apex_Class_" in data[i]]
    triggers = [data[i].replace("Apex_Trigger_", "") for i in range(len(data)) if "Apex_Trigger_" in data[i]]

    package_xml = create_package_xml(custom_objects, pages, components, classes, triggers, encoded)

    # TODO - Debugging purposes (to be removed)
    # print(len(custom_objects), custom_objects)
    # print(len(pages), pages)
    # print(len(components), components)
    # print(len(classes), classes)
    # print(len(triggers), triggers)

    return package_xml


def create_package_xml(co, page, comp, cl, t, highlighted):
    xml = []

    if highlighted:
        # Start of the file
        xml.append('<pre class="language-xml" id="textdata"><span class="pun">&lt;?</span><span class="pln">xml version</span><span class="pun">=</span><span class="str">"1.0"</span><span class="pln"> encoding</span><span class="pun">=</span><span class="str">"UTF-8"</span><span class="pun">?&gt;</span><span class="pln"></span><br><span class="pln"></span><span class="tag">&lt;Package</span><span class="pln"> </span><span class="atn">xmlns</span><span class="pun">=</span><span class="atv">"http://soap.sforce.com/2006/04/metadata"</span><span class="tag">&gt;</span><span class="pln"></span><br>')

        # Dynamically created content
        xml.append(sobjects_xml(co, "CustomObject", True))  # Custom Objects
        xml.append(sobjects_xml(cl, "ApexClass", True))  # Apex Classes
        xml.append(sobjects_xml(comp, "ApexComponent", True))  # Apex Components
        xml.append(sobjects_xml(page, "ApexPage", True))  # Apex Pages
        xml.append(sobjects_xml(t, "ApexTrigger", True))  # Apex Triggers

        # End of the file
        xml.append('<span class="pln">&nbsp; &nbsp; </span><span class="tag">&lt;version&gt;</span><span class="pln">34.0</span><span class="tag">&lt;/version&gt;</span><span class="pln"></span><br><span class="tag">&lt;/Package&gt;</span><br>')

    else:
        # Start of the file
        xml.append('<?xml version="1.0" encoding="UTF-8"?>\n')
        xml.append('<Package xmlns="http://soap.sforce.com/2006/04/metadata">\n')

        # Dynamically created content
        xml.append(sobjects_xml(co, "CustomObject", False))
        xml.append(sobjects_xml(page, "ApexPage", False))
        xml.append(sobjects_xml(cl, "ApexClass", False))
        xml.append(sobjects_xml(comp, "ApexComponent", False))
        xml.append(sobjects_xml(t, "ApexTrigger", False))

        # End of the file
        xml.append('    <version>34.0</version>\n')
        xml.append('</Package>\n')

    formatted_string = ''
    for i in range(len(xml)):
        formatted_string += xml[i]

    return formatted_string


def sobjects_xml(list, sobject, highlighted):
    o_types = '<span class="pln">&nbsp; &nbsp; </span><span class="tag">&lt;types&gt;</span><br>'
    c_types = '<span class="pln">&nbsp; &nbsp; </span><span class="tag">&lt;/types&gt;</span><br>'
    o_memb = '<span class="pln">&nbsp; &nbsp; &nbsp; &nbsp; </span><span class="tag">&lt;members&gt;</span><span class="pln">'
    c_memb = '</span><span class="tag">&lt;/members&gt;</span><br>'
    o_name = '<span class="pln">&nbsp; &nbsp; &nbsp; &nbsp; </span><span class="tag">&lt;name&gt;</span><span class="pln">'
    c_name = '</span><span class="tag">&lt;/name&gt;</span><br>'
    types_s = "    <types>\n"
    types_e = "    </types>\n"
    memb_s = "        <members>"
    memb_e = "</members>\n"
    name_s = "        <name>"
    name_e = "</name>\n"

    xml = []
    if len(list) != 0:
        if highlighted:
            xml.append(o_types)
            for i in range(len(list)):
                xml.append(o_memb + list[i] + c_memb)
            xml.append(o_name + sobject + c_name)
            xml.append(c_types)

        else:
            xml.append(types_s)
            for i in range(len(list)):
                xml.append(memb_s + list[i] + memb_e)
            xml.append(name_s + sobject + name_e)
            xml.append(types_e)

        s = ''
        for i in range(len(xml)):
            s += xml[i]

        return s

    return ''


# TODO - Labels can be added in
# ApexClasses ApexPages ApexComponents
# Dyanmic, non dynamic
# {!$Label['AR_LanguageLabel_'+languageItem.ISO_Code__c]}
# output.expressions.value = '{!$Label.ARDC_' + categoryGroup.getName() + '}';

