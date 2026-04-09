import urllib.request
import urllib.error
import json

req = urllib.request.Request(
    'http://localhost:5000/user/google-login',
    data=json.dumps({"token":"invalid"}).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

try:
    urllib.request.urlopen(req)
except urllib.error.HTTPError as e:
    print(e.read().decode('utf-8'))
