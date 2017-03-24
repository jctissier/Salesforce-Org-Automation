# Import flask and template operators
from flask import Flask, render_template


# Define the WSGI application object
app = Flask(__name__)

# Configurations
app.config.from_object('config')



# Sample HTTP error handling
@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404


# Import a module / component using its blueprint handler variable (labels) -> Import all the controllers
from app.organize_labels.controllers import labels
from app.auth_login.controllers import create_login



# Register blueprint(s)
app.register_blueprint(labels)
app.register_blueprint(create_login)


