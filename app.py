from starlette.applications import Starlette
from starlette.responses import UJSONResponse
import gpt_2_simple as gpt2
import tensorflow as tf
import uvicorn
import os
import gc
import sys
from google.cloud import logging

logging_client = logging.Client()
# The name of the log to write to
log_name = 'my-log'
# Selects the log to write to
logger = logging_client.logger(log_name)

app = Starlette(debug=False)

sess = gpt2.start_tf_sess(threads=1)
gpt2.load_gpt2(sess)

# Needed to avoid cross-domain issues
response_header = {
	'Access-Control-Allow-Origin': '*'
}

generate_count = 0


@app.route('/', methods=['GET', 'POST', 'HEAD'])
async def homepage(request):
	# gpt2.reset_session(sess)
	# sess = gpt2.start_tf_sess(threads=1)
	# gpt2.load_gpt2(sess)

	global generate_count
	global sess

	if request.method == 'GET':
		params = request.query_params
	elif request.method == 'POST':
		params = await request.json()
	elif request.method == 'HEAD':
		return UJSONResponse({'text': ''},
							 headers=response_header)

	text = gpt2.generate(sess,
						 length=int(params.get('length', 100)),
						 temperature=float(params.get('temperature', 0.7)),
						 top_k=int(params.get('top_k', 0)),
						 top_p=float(params.get('top_p', 0)),
						 prefix="The weather is ",
						 truncate=params.get('truncate', None),
						 include_prefix=str(params.get(
							 'include_prefix', True)).lower() == 'true',
						 return_as_list=True
						 )[0]

	generate_count += 1
	if generate_count == 8:
		# Reload model to prevent Graph/Session from going OOM
		tf.reset_default_graph()
		sess.close()
		sess = gpt2.start_tf_sess(threads=1)
		gpt2.load_gpt2(sess)
		generate_count = 0

	gc.collect()
	return UJSONResponse({'text': text},
						 headers=response_header)

text = "Version 0.30 Active"
logger.log_text(text) 
print('Logged: {}'.format(text))

# cwd = os.getcwd()
# files = os.listdir(cwd)
# logger.log_text(str(files)) 

# files2 = os.listdir(cwd+"/models/run1")
# files3 = os.listdir(cwd+"/checkpoint/run1")

# logger.log_text(str(files2)) 
# logger.log_text(str(files3)) 

# gpt2.reset_session(sess)
# trainNewModel()
# sess = gpt2.start_tf_sess(threads=1)
# gpt2.load_gpt2(sess)

if __name__ == '__main__':
	uvicorn.run(app, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
