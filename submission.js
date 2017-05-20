/**
 * Created by vpetrenko on 03.05.17.
 */

'use strict';

class BaseSchedule {

    constructor() {
        this.map = new Map();
    }

    getItem() {
        this._sortList();
        return this.map
    }

    _sortList() {
        this.map = new Map([...this.map.entries()].sort(this._sortByDate));
    }

    _sortByDate(a, b) {}
}

class Schedule extends BaseSchedule {

    add(date, event) {
        let dateKey = moment(date, TIME_FORMAT_DATETIME).format(TIME_FORMAT_DATE);

        let dateEvents = this.map.get(dateKey);
        dateEvents = dateEvents || new DaySchedule();
        dateEvents.add(date, event);

        this.map.set(dateKey, dateEvents);
    }

    _sortByDate (a,b){
        return new Date(b[0]).getTime() - new Date(a[0]).getTime()
    };
}

class DaySchedule extends BaseSchedule {

    add(date, event) {
        let dateKey = moment(date, TIME_FORMAT_DATETIME).format(TIME_FORMAT_DATETIME);

        let dateEvents = this.map.get(dateKey);
        dateEvents = dateEvents || [];
        dateEvents.push(event);

        this.map.set(dateKey, dateEvents);
    }

    _sortByDate (a,b){
        return new Date(a[0]).getTime() - new Date(b[0]).getTime()
    };
}

class Event {
    constructor(text, date) {
        this.date = date;
        this.text = text;
    }
}

const TIME_FORMAT_TIME = "HH:mm";
const TIME_FORMAT_DATETIME = "YYYY-MM-DD HH:mm";
const TIME_FORMAT_DATE = "YYYY-MM-DD";

class Submission {

    constructor(params) {
        this.root = params.form;
        this.table = params.table;
        this.schedule = new Schedule();

        this._setActions();
    }

    _clearTable() {
        while(this.table.rows.length > 1) {
            this.table.deleteRow(1);
        }
    }

    _renderTable() {

        this._clearTable();

        this.schedule.getItem().forEach( (daySchedule, date, map) => {

            let taskList = [];
            daySchedule.getItem().forEach((tasks, date, map) => {
                tasks.forEach(event => {
                    let time = moment(event.date, TIME_FORMAT_DATETIME).format(TIME_FORMAT_TIME);
                    taskList.push(`${time} - ${event.text}`)
                });
            });

            // insert row
            let newRow = this.table.querySelector("tbody").insertRow(0);
            newRow.insertCell(0).appendChild(document.createTextNode(date));

            let tasksElement = document.createElement('p');
            tasksElement.innerHTML =  taskList.join("<br/>");

            newRow.insertCell(1).appendChild(tasksElement);
        });
    }

    _setActions() {
        let self = this;

        this.root.addEventListener('submit', function(e) {
            e.preventDefault();

            let text = this.querySelector("#text").value;
            let date = $('#datetimepicker').data("DateTimePicker").date();
            let event = new Event(text, date);

            // map
            self.schedule.add(date, event);

            self._renderTable()
        })
    }
}