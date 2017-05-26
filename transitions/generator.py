techs = ["fda","fdt","gestalt","gmap","matrixa","matrixt","shi"]

for tech1 in techs:
	for tech2 in techs:
		with open(tech1+"-"+tech2+".txt","w") as file:
			file.write("todo")