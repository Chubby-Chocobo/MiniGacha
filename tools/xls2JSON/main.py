import os
import glob
import csv
import json
import re
import xlwt
import xlrd
from xlwt import *
from xlrd import *

TABLE_MAPPING = {
    "item" : {
        "id"                    : "int",
        "name"                  : "text",
        "rarity"                : "int"
    },
    "gacha" : {
        "id"                    : "int",
        "name"                  : "text",
        "type"                  : "text",
        "payment_type"          : "text",
        "price"                 : "int",
        "quantity"              : "int"
    },
    "gacha_free" : {
        "gacha_id"              : "int",
        "wait_interval"         : "int"
    },
    "gacha_weight" : {
        "gacha_id"              : "int",
        "item_id"               : "int",
        "weight"                : "int"
    },
    "gacha_box" : {
        "gacha_id"              : "int",
        "reset_condition"       : "text",
        "reset_condition_value" : "text"
    },
    "gacha_box_content" : {
        "gacha_id"              : "int",
        "item_id"               : "int",
        "num"                   : "int"
    },
    "text" : {
        "key"                   : "text",
        "value"                 : "text"
    }
}

def getTableData(sheet_name, worksheet):
    result = []
    cols = []
    global TABLE_MAPPING
    try :
        cols = list(worksheet.row(0))
    except IndexError:
        print (sheet_name + ": Invalid header data.")

    num_rows = worksheet.nrows
    num_cols = worksheet.ncols
    curr_row = 1;
    while curr_row < num_rows :
        entity = {}
        row = worksheet.row(curr_row)
        curr_col = 0
        isActive = True
        while curr_col < num_cols :
            col_name = cols[curr_col].value
            # Cell Types: 0=Empty, 1=Text, 2=Number, 3=Date, 4=Boolean, 5=Error, 6=Blank
            cell_type = worksheet.cell_type(curr_row, curr_col)
            cell_value = worksheet.cell_value(curr_row, curr_col)

            if col_name not in TABLE_MAPPING[sheet_name]:
                curr_col += 1
                continue

            predefined_type = TABLE_MAPPING[sheet_name][col_name]

            if predefined_type == "int" :
                if not cell_value :
                    cell_value = 0
                else :
                    cell_value = int(cell_value)
            elif predefined_type == "float" :
                if not cell_value :
                    cell_value = 0
                else :
                    cell_value = float(cell_value)
            elif predefined_type == "text" :
                if not cell_value :
                    cell_value = ""
            curr_col += 1
            if col_name == "is_active":
                if cell_value == "FALSE":
                    isActive = False
            else :
                entity[col_name] = cell_value;
        if not isActive:
            print "Skip inactive item...."
        else :
            result.append(entity)
        curr_row += 1
    return result


def main():
    output_data = {}

    workbook = xlrd.open_workbook("../../data/master/master.xls")
    sheet_names = workbook.sheet_names()
    for sheet_name in sheet_names :
        worksheet = workbook.sheet_by_name(sheet_name)
        output_data[str(sheet_name)] = getTableData(sheet_name, worksheet)

    out = open("../../data/master/output/master.js", "w")
    out.write("module.exports=" + json.dumps(output_data, sort_keys=True, indent=2))

main()