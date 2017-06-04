from flask import Flask, redirect
from flask import render_template
from flask import request
import string
import random
from flask_sslify import SSLify

app = Flask(__name__)
sslify = SSLify(app)

@app.route("/webrtc")
def cocokua_webrtc():
	return render_template('index_webrtc.html')

@app.route("/")
def cocokua_home():
	return render_template('index.html')

@app.route('/i_<video>_n_<room>/')
def cocokua_invite(video, room):
        return render_template('index.html')

@app.route('/c_<video>_n_<room>/')
def cocokua_create(video, room):
        return render_template('index.html')

@app.route('/r_<video>_n_<room>/')
def cocokua_room(video, room):
        return render_template('room.html', v=video, r=room)

@app.route('/watch')
def cookua_from_youtube_to_room():
        room = ''.join(random.SystemRandom().choice(string.ascii_letters + string.digits) for _ in range(11))
        video = request.args.get('v')
        url = '/r_'+video+'_n_'+room
        return redirect(url)

@app.route("/PrivacyPolicy/")
def cocokua_PrivacyPolicy():
	return render_template('PrivacyPolicy.html')

@app.route("/sitemap")
def cocokua_Sitemap():
        return render_template('sitemap.xml')

if __name__ == "__main__":
	app.run(host='0.0.0.0', debug=True)

