import os
from collections import defaultdict

coms = defaultdict(int)

for filename in os.listdir("."):
	if filename.endswith(".txt"):
		with open(filename,"r") as txtfile:
			for line in txtfile:
				line = line.strip()
				if len(line) == 0:
					continue
				if line.startswith("#"):
					continue
				coms[line]+=1

commands = sorted(coms.items(), key=lambda tup: tup[0])
for (com,num) in commands:
	print str(num)+"\t"+com
