import json
import csv

timesteps = []

for timestamp in xrange(1,16):
	nodes = []
	edges = []
	filename = 'newfrat'+format(1,'02')+".csv"
	with open(filename,'r') as datafile:
		reader = csv.reader(datafile, delimiter="\t")
		for n in xrange(0,17):
			nodes.append(n)

		fr = 0
		for row in reader:
			to = 0
			for val in row:
				edge = {}
				edge["ranker"] = fr
				edge["rankee"] = to
				edge["rank"] = int(val)
				edges.append(edge)
				to+=1
			fr+=1
	timestep = {}
	timestep["timestamp"] = timestamp
	timestep["nodes"] = nodes
	timestep["edges"] = edges
	timesteps.append(timestep)

print json.dumps(timesteps, indent=2)