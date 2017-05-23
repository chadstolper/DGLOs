from collections import defaultdict as dd
import csv
import json
from sys import stderr as err

emails = dd(list) #timestep to list

nodes = set()
mintime = False
maxtime = False

# window_size = 1000
timestep_size	= 100000
window_size 	= 1000000
steps_per_timestep = 10
window_shifted = window_size/timestep_size


# with open('emails_sample.tsv','r') as email_file:
with open('emails.tsv','r') as email_file:
	reader = csv.DictReader(email_file, delimiter='\t')
	for line in reader:
		# nodes.add(line['to'])
		# nodes.add(line['from'])
		line['timestamp'] = int(line['timestamp'])//timestep_size
		line['weight'] = int(line['weight'])
		emails[line['timestamp']].append(line)
		if mintime==False:
			mintime = int(line['timestamp'])
			maxtime = int(line['timestamp'])
		mintime = min(mintime,int(line['timestamp']))
		maxtime = max(maxtime,int(line['timestamp']))


err.write (str((mintime,maxtime,maxtime-mintime))+"\n")

timesteps = []
nodes = sorted(nodes)

max_node_count = 0
max_edge_count = 0
max_max = 0

for start in xrange(mintime,maxtime+steps_per_timestep,steps_per_timestep):
	timestep = {}
	timestep["nodes"] = set()
	tedges = dd(lambda: dd(int))
	trail_start = start-window_shifted
	timestep['timestamp'] = start
	for t in xrange(trail_start,start+1):
		if t in emails:
			for edge in emails[t]:
				tedges[edge['to']][edge['from']]+=1;
				timestep["nodes"].add(edge['to'])
				timestep["nodes"].add(edge['from'])
	timestep["edges"] = []
	for to in tedges:
		for fr in tedges[to]:
			edge = {}
			edge["to"] = to
			edge["from"] = fr
			edge["weight"] = tedges[to][fr]
			timestep["edges"].append(edge)
	timestep["nodes"] = list(timestep["nodes"])
	max_node_count = max(max_node_count,len(timestep["nodes"]))
	max_edge_count = max(max_edge_count,len(timestep["edges"]))
	max_max = max(max_max, len(timestep["nodes"])+len(timestep["edges"]))
	timesteps.append(timestep)

print json.dumps(timesteps, indent=2, sort_keys=True)

err.write (str((max_node_count, max_edge_count, max_max))+"\n")




1262454010
1285884492