/**
 * Created by vpetrenko on 03.05.17.
 */

'use strict';

const API_URL = "/api/events";
const TIME_FORMAT_TIME = "HH:mm";
const TIME_FORMAT_DATETIME = "YYYY-MM-DD HH:mm";
const TIME_FORMAT_DATE = "YYYY-MM-DD";

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
        this.tasks = [];
        this.map = new Map();
        this._setActions();
        this._loadEvents();

        toastr.options = {
            "positionClass": "toast-top-right"
        };
    }

    _loadEvents() {
        fetch(API_URL)
            .then(response => response.json())
            .then(items => {
                items.forEach(item => {
                    let dataModel = new DataModel(item.text, item.date);
                    this.tasks.push(dataModel);
                    this._renderTable();
                });
            })
            .catch(e => toastr.error('Error during event saving: ' + e));
    }

    _saveEvent(event) {
        event.date = moment(event.date, TIME_FORMAT_DATETIME).format(TIME_FORMAT_DATETIME);

        fetch(API_URL,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(event)
            })
            .then(res => res.json())
            .then(data => toastr.success('Successfully saved event!'))
            .catch(e => toastr.error('Error during event saving'))
    }

    _clearTable() {
        while(this.table.rows.length > 1) {
            this.table.deleteRow(1);
        }
    }

    _renderTable() {

        this.tasks = this.tasks.sort(Submission._sortEvents);
        this._setMap();
        this._clearTable();

        this.map.forEach( (tasks, date, map) => {

            let taskList = [];
            tasks.forEach(dataModel => {
                let date = moment(dataModel.date, TIME_FORMAT_DATETIME).format(TIME_FORMAT_TIME);
                taskList.push(`${date} - ${dataModel.text}`)
            });

            // insert row to the last row
            let lastIndex = this.table.rows.length - 1;
            let newRow = this.table.querySelector("tbody").insertRow(lastIndex);
            newRow.insertCell(0).appendChild(document.createTextNode(date));

            let tasksElement = document.createElement('p');
            tasksElement.innerHTML =  taskList.join("<br/>");

            newRow.insertCell(1).appendChild(tasksElement);
        });
    };

    static _sortEvents(a,b) {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
    }

    _setMap() {
        this.map = new Map();

        this.tasks.forEach(task => {

            // map
            let dateKey = moment(task.date, TIME_FORMAT_DATETIME).format(TIME_FORMAT_DATE);
            let currentTasks = this.map.get(dateKey);

            currentTasks = currentTasks || [];
            currentTasks.push(task);

            this.map.set(dateKey, currentTasks);
        });
    }

    _setActions() {
        let self = this;

        this.root.addEventListener('submit', function(e) {
            e.preventDefault();

            let text = this.querySelector("#text").value;
            let date = $('#datetimepicker').data("DateTimePicker").date();
            let dataModel = new DataModel(text, date);

            self.tasks.push(dataModel);
            self._saveEvent(dataModel);

            self._renderTable()
        })
    }
}