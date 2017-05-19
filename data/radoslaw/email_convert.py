from collections import defaultdict as dd
import csv
import json

emails = dd(list) #timestep to list

nodes = set()
mintime = False
maxtime = False

# window_size = 1000
window_size = 100

with open('email_sample.tsv','r') as email_file:
	reader = csv.DictReader(email_file, delimiter='\t')
	for line in reader:
		nodes.add(line['to'])
		nodes.add(line['from'])
		emails[line['timestamp']].append(line)
		if mintime==False:
			mintime = int(line['timestamp'])
			maxtime = int(line['timestamp'])
		mintime = min(mintime,int(line['timestamp']))
		maxtime = max(maxtime,int(line['timestamp']))

print (mintime,maxtime)

timesteps = []
nodes = sorted(nodes)

for middle_shifted in xrange(mintime/window_size,(maxtime/window_size)+1):
	timestep = {}
	# timestep["nodes"] = tnodes = nodes
	timestep["edges"] = tedges = []
	start = 
	timestep['timestamp'] = timestamp_start*window_size #shift
	for t in xrange(timestamp_start*window_size,timestamp_start*window_size+window_size):
		if t in emails:
			for edge in emails[t]:
				tedges.append(edge)
	timesteps.append(timestep)

print json.dumps(timesteps, indent=2, sort_keys=True)




1262454010
1285884492