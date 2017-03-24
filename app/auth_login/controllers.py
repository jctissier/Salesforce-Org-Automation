from flask import Blueprint, request, render_template, make_response, jsonify, session, g, redirect, url_for
import app.auth_login.models as org_login
import json

# Define the blueprint: 'labels', set its url prefix: app.url/custom-labels/...
create_login = Blueprint('login', __name__)

sf = 'SF'
session_id = 'Session'
instance = 'Instance'


@create_login.route('/', methods=['GET'])
@create_login.route('/login', methods=['GET', 'POST'])
def authenticate_login():
    if 'user' not in session:
        global sf
        global session_id
        global instance
        if request.method == 'POST':
            session.pop('user', None)

            username = request.form['username']
            password = request.form['password']
            token = request.form['token']

            print(username, password, token)

            if username and password and token:
                status, sf, session_id, instance = org_login.login_attempt(username, password, token)
                print("Status: " + str(status))
                if status == 401:
                    return jsonify({'error': 'Log In Error, please check your credentials'})
            else:
                return jsonify({'error': 'Log In Error, one of the required fields have not been filled out'})

            session['user'] = username                                                          # Set the session
            session['password'] = password
            session['token'] = token

            # Successfully logged in
            return jsonify({'success': 'You have been successfully logged in!'})

        # Log in page if user is not logged in
        return render_template('login/groundswell_login.html', login_session=g.user)

    # Redirect to dashboard when user is logged in already
    return redirect(url_for('login.dashboard'))


@create_login.before_request
def before_request():
    g.user = False
    g.password = False
    g.token = False
    if 'user' in session:
        g.user = session['user']
        g.password = session['password']
        g.token = session['token']
        print("User in Session: ")
        print(g.user, g.password, g.token)


@create_login.route('/logout', methods=['GET'])
def logout():
    if 'user' in session:
        session.pop('user', None)
        return render_template('login/logout.html', login_session=False)

    return redirect(url_for('login.dashboard'))


@create_login.route('/dashboard', methods=['GET'])
def dashboard():
    if 'user' in session:
        return render_template('dashboard.html', login_session=g.user)

    return redirect(url_for('login.authenticate_login'))


@create_login.route('/dashboard-ajax', methods=['POST'])
def dashboard_ajax():
    status, sf, session_id, instance = org_login.login_attempt(g.user, g.password, g.token)
    c_list, c_size = org_login.dashboard_custom_objects(sf)
    u_list, u_size = org_login.dashboard_sobject_query(sf, 'User')
    p_list, p_size = org_login.dashboard_sobject_query(sf, 'Profile')
    ur_list, ur_size = org_login.dashboard_sobject_query(sf, 'UserRole')
    cl_list, cl_size = org_login.dashboard_sobject_query(sf, 'ApexClass')
    pa_list, pa_size = org_login.dashboard_sobject_query(sf, 'ApexPage')
    comp_list, comp_size = org_login.dashboard_sobject_query(sf, 'ApexComponent')
    t_list, t_size = org_login.dashboard_sobject_query(sf, 'ApexTrigger')

    return jsonify(
        {
            'success': '200',
            'c_size': c_size,
            'c_list': c_list,

            'u_size': u_size,
            'u_list': u_list,

            'p_size': p_size,
            'p_list': p_list,

            'ur_size': ur_size,
            'ur_list': ur_list,

            'cl_size': cl_size,
            'cl_list': cl_list,

            'comp_size': comp_size,
            'comp_list': comp_list,

            'pa_size': pa_size,
            'pa_list': pa_list,

            't_size': t_size,
            't_list': t_list
        }
    )


@create_login.route('/package-xml-ajax', methods=['POST'])
def package_xml_ajax():
    try:
        package_ids = request.form['list_ids']
        data = json.loads(package_ids)                              # Load into json string
        package_ids = [val[1] for val in data.items()]              # retrieve values from json string
        print(package_ids)

    except Exception as e:
        return jsonify({'code': 'ERROR : ' + str(e)})

    package_xml = org_login.sobjects_mapping(package_ids, True)

    return jsonify(
        {
            'code': package_xml
        }
    )


@create_login.route('/download-package-xml', methods=['POST'])
def download_package_ajax():

    result = 'test'

    response = make_response(result)
    response.headers["Content-Disposition"] = "attachment; filename=Package.xml"
    return response


