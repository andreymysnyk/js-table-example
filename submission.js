/**
 * Created by vpetrenko on 03.05.17.
 */

'use strict';

class DataModel {
    constructor(text, date) {
        this.date = date;
        this.text = text;
    }
}

class Submission {

    constructor(params) {
        this.root = params.form;
        this.table = params.table;

        this.map = new Map();
        this._setActions();
    }

    _clearTable() {
        while(this.table.rows.length > 1) {
            this.table.deleteRow(1);
        }
    }

    _renderTable() {

        this._clearTable();

        this.map.forEach( (tasks, date, map) => {

            let taskList = [];
            tasks.forEach(dataModel => {
                taskList.push(" - " + dataModel.text)
            });

            // insert row
            let newRow = this.table.querySelector("tbody").insertRow(0);
            newRow.insertCell(0).appendChild(document.createTextNode(date));

            let tasksElement = document.createElement('p');
            tasksElement.innerHTML =  taskList.join("<br/>")

            newRow.insertCell(1).appendChild(tasksElement);
        });
    }

    _sortList() {
        this.map = new Map([...this.map.entries()].sort(function(a,b){
            let date1 = moment(a[0], 'YYYY-MM-DD HH:mm');
            let date2 = moment(b[0], 'YYYY-MM-DD HH:mm');

            return date1 < date2
        }));
    }

    _setActions() {
        let self = this;

        this.root.addEventListener('submit', function(e) {
            e.preventDefault();

            let text = this.querySelector("#text").value;
            let date = $('#datetimepicker').data("DateTimePicker").date();
            let dataModel = new DataModel(text, date);

            // map
            let dateKey = moment(date, 'YYYY-MM-DD HH:mm').format("YYYY-MM-DD");

            let currentTasks = self.map.get(dateKey);
            currentTasks = currentTasks || [];
            currentTasks.push(dataModel);

            self.map.set(dateKey, currentTasks);
            self._sortList();
            self._renderTable()
        })
    }
}