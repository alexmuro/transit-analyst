#!/usr/bin/python
#
#Run like createSchema.py localhost gtfszipfile.ziplocal


import os
from os import sys
import zipfile
import MySQLdb
import csv

#types of each table: s for string, i for any number 
tableFieldTypes = {'agency':['pk','s', 's', 's', 's', 's'],
        'calendar_dates':['i', 's', 'i'],
        'routes': ['i','s','s','s','i','s','s'],
        'shapes':['i','i','i','i','i'],
        'stop_times':['i','s','s','i','i','i','i','s'],
        'stops':['i','s','s','s','i','i','i'],
        'trips':['i','i','i','s','i','s','i']
        }



def connectToDB():
    #return MySQLdb.connect(host='njtransit.availabs.org', user='njtransit', passwd='am1238wk')
    db = MySQLdb.connect(user='root', passwd='am1238wk')
    db.autocommit(True)
    return db

def populateSchema(db):
    cursor = db.cursor()
    cursor.connection.autocommit(True)
    for tableName,fieldTypes in tableFieldTypes.iteritems():
        print tableName
        populateTable(cursor, tableName, fieldTypes)

def populateTable(cursor, tableName, fieldTypes):
    rows = '' 
    f = open(tableName + '.txt', 'r')
    f.readline() #throw away first line
    rowNum = 1

    with open(tableName + '.txt', 'rb') as f:
        next(f)
        for line in csv.reader(f, strict=True):

            if len(rows) + len(''.join(line)) > 90000:  #this is so we don't have statements that are too big
                executeInsertStatement(cursor, tableName, rows)
                rows = ''

            i = 0

            row = '('  
            for field in line:  #create row tuple

                field = '\\\''.join(field.split('\'')) #escape quote

                if fieldTypes[i] == 's':
                    row += '\'' + field.strip() + '\','
                elif fieldTypes[i] == 'i':
                    row += field.strip() + ','
                elif fieldTypes[i] == 'pk':
                    row += str(rowNum) + ','
                i += 1

            row = row.rstrip(',') + '),' #remove last comma
            rows += row
            rowNum += 1

        executeInsertStatement(cursor, tableName, rows)


   
def executeInsertStatement(cursor, tableName, rows):
    statement = "INSERT INTO " + tableName + " VALUES " + rows.rstrip(",") + ";"
    

    try:
        print statement
        cursor.execute(statement)
    except:
        print statement
        raise 

 



def createSchema(db, schemaName):
    cursor = db.cursor()
    cursor.execute("DROP DATABASE IF EXISTS GTFS_" + schemaName + ";")
    cursor.execute("CREATE DATABASE IF NOT EXISTS GTFS_" + schemaName)
    db.select_db('GTFS_' + schemaName)
    cursor.execute("""

CREATE TABLE `agency` (
  `agency_id` int(11) NOT NULL DEFAULT '0',
  `agency_name` varchar(255) DEFAULT NULL,
  `agency_url` varchar(255) DEFAULT NULL,
  `agency_timezone` varchar(255) DEFAULT NULL,
  `agency_lang` varchar(255) DEFAULT NULL,
  `agency_phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`agency_id`)
);



CREATE TABLE `calendar_dates` (
  `service_id` int(11) DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL, 
  `exception_type` int(2) DEFAULT NULL
); 


CREATE TABLE `routes` (
  `route_id` int(11) NOT NULL DEFAULT '0',
  `agency_id` varchar(255) DEFAULT NULL,
  `route_short_name` varchar(255) DEFAULT NULL,
  `route_long_name` varchar(255) DEFAULT NULL,
  `route_type` int(2) DEFAULT NULL,
  `route_url` varchar(255) DEFAULT NULL,
  `route_color` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`route_id`)
);

CREATE TABLE `shapes` (
  `shape_id` int(11) DEFAULT NULL,
  `shape_pt_lat` float(10,6) DEFAULT NULL,
  `shape_pt_lon` float(10,6) DEFAULT NULL,
  `shape_pt_sequence` int(11) DEFAULT NULL,
  `shape_dist_traveled` float(10,6) DEFAULT NULL,
  UNIQUE KEY `singleShape` (`shape_id`,`shape_pt_sequence`)
); 

CREATE TABLE `stop_times` (
  `trip_id` int(11) DEFAULT NULL,
  `arrival_time` time DEFAULT NULL,
  `departure_time` time DEFAULT NULL,
  `stop_id` int(11) DEFAULT NULL,
  `stop_sequence` int(11) DEFAULT NULL,
  `pickup_type` int(2) DEFAULT NULL,
  `drop_off_type` int(2) DEFAULT NULL,
  `shape_dist_traveled` varchar(255) DEFAULT NULL
); 

CREATE TABLE `stops` (
  `stop_id` int(11) NOT NULL DEFAULT '0',
  `stop_code` varchar(255) DEFAULT NULL,
  `stop_name` varchar(255) DEFAULT NULL,
  `stop_desc` varchar(255) DEFAULT NULL,
  `stop_lat` decimal(8,6) DEFAULT NULL,
  `stop_lon` decimal(8,6) DEFAULT NULL,
  `zone_id` int(11) DEFAULT NULL,
    PRIMARY KEY (`stop_id`)
); 

CREATE TABLE `trips` (
  `route_id` int(11) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL,
  `trip_id` int(11) NOT NULL DEFAULT '0',
  `trip_headsign` varchar(255) DEFAULT NULL,
  `direction_id` tinyint(1) DEFAULT NULL,
  `block_id` varchar(255) DEFAULT NULL,
  `shape_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`trip_id`)
); 
            
            """)
    cursor.close()
    

def main(argv):
    if len(argv) != 3:
        raise RuntimeError('Not enough arguments')

    db = connectToDB()
    createSchema(db, argv[2])
    
    # try:
    #     os.mkdir(chdir[1][:-4])
    # except OSError:
    #     pass

    #os.chdir(argv[1][:-4])
    zipfile.ZipFile(argv[1]).extractall()

    populateSchema(db)
    db.close()

if __name__ == "__main__":
    main(sys.argv)
