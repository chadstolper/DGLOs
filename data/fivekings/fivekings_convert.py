import csv
from csv import DictReader as dr
from collections import defaultdict as dd
import json

year = -1

with open('fivekings.csv','r') as fivekings:
	reader = dr(fivekings)
	timesteps = []
	timestep = {}
	for line in reader:
		attackers = line["attacker_commander"].split(", ")
		defenders = line["defender_commander"].split(", ")
		if len(attackers[0])<1 or len(defenders[0])<1:
			continue
		if line["year"] != year:
			timestep = {}
			timesteps.append(timestep)
			timestep["year"] = line["year"]
			edges = timestep["edges"] = dd(int)
			edges_joint = timestep["edges_joint"] = {}
			nodes = timestep["nodes"] = set()
		for a in attackers:
			nodes.add(a)
			for d in defenders:
				nodes.add(d)
				edges[a+","+d]+=1
				if a+","+d in edges_joint:
					edges_joint[a+","+d]+=1
				elif d+","+a in edges_joint:
					edges_joint[d+","+a]+=1
				else:
					edges_joint[a+","+d] = 1

for ts in timesteps:
	edges = []
	edges_joint = []
	for k,v in ts["edges"].iteritems():
		edge = {}
		parts = k.split(",")
		edge["attacker"] = parts[0]
		edge["defender"] = parts[1]
		edge["count"] = v
		edges.append(edge)
	for k,v in ts["edges_joint"].iteritems():
		edge = {}
		parts = k.split(",")
		edge["party1"] = parts[0]
		edge["party2"] = parts[1]
		edge["count"] = v
		edges_joint.append(edge)
	ts["edges"] = edges
	ts["edges_joint"] = edges_joint
	ts["nodes"] = list(ts["nodes"])


print json.dumps(timesteps, indent=2, separators=(',', ': '))

