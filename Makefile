all :
	npx webpack --stats-error-details

.PHONY : clean

clean : 
	rm dist/table_test.js