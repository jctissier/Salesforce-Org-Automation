from flask import Blueprint, request, render_template, session, redirect, url_for, g, jsonify
import app.organize_labels.models as models
import app.auth_login.models as login


# Define the blueprint: 'labels', set its url prefix: app.url/custom-labels/...
labels = Blueprint('labels', __name__, url_prefix='/custom-labels')

sf = 'SF'
session_id = 'Session'
instance = 'Instance'


@labels.route('/view', methods=['GET', 'POST'])
def view_labels():
    print("In View_Labels()")
    if 'user' in session:
        return render_template("labels/display_labels.html", login_session=session['user'])

    return redirect(url_for('login.authenticate_login'))


@labels.route('/track', methods=['POST'])
def ajax_login():
    global sf
    global session_id
    global instance
    if 'user' in session:
        print("Set Global in Labels from Login Credentials: ")
        print(session['user'], session['password'], session['token'])
        status, sf, session_id, instance = login.login_attempt(session['user'], session['password'], session['token'])
        return jsonify({'success': session['user'], 'instance': instance})

    return jsonify({'error': 'Can\'t connect to the Salesforce Server, please try again.'})
