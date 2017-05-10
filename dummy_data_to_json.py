from collections import defaultdict
import json

with open('DummyData.tsv','r') as dummyfile:
	new_timestep = True
	timestamps = []
	people = []
	drinks = []
	row_index = 0
	for line in dummyfile:
		if line.startswith("#"):
			continue
		line = line.rstrip()
		values = line.split("\t")
		pairs = []
		for val in values:
			pairs.append(val.split(" | "))
		if len(pairs) == 1:
			new_timestep = True
			continue
		if new_timestep:
			timestamps.append( defaultdict(list) )
			row_index = 0
			for pair in pairs:
				if len(pair) <= 1:
					continue
				node = {}
				node["type"] = "drink"
				node["name"] = pair[0]
				node["role"] = None
				node["price"] = pair[1]
				timestamps[-1]["nodes"].append(node)
				if not node["name"] in drinks:
					drinks.append(node["name"])
				node["id"] = drinks.index(node["name"])
			new_timestep = False
			continue
		# not new_timestep
		is_person = True
		col_index = 0
		for pair in pairs:
			if len(pair) <= 1:
				continue
			if is_person:
				node = {}
				node["type"] = "person"
				node["name"] = pair[0]
				node["role"] = pair[1]
				node["price"] = None
				timestamps[-1]["nodes"].append(node)
				is_person = False
				if not node["name"] in people:
					people.append(node["name"])
				node["id"] = people.index(node["name"])
			else:
				edge = {}
				edge["source"] = row_index
				edge["target"] = col_index
				edge["source_name"] = people[row_index]
				edge["target_name"] = drinks[col_index]
				edge["preference"] = pair[0]
				edge["consumption"] = pair[1]
				timestamps[-1]["edges"].append(edge)
				col_index +=1
		row_index+=1

with open('dummy.json','w') as outfile:
	outfile.write(json.dumps(timestamps, indent=2, sort_keys = True))