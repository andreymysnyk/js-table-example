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
        this.items = [];

        this._setActions();
    }

    _setActions() {
        let self = this;

        this.root.addEventListener('submit', function(e) {
            e.preventDefault();

            let text = this.querySelector("#text").value;
            let date = this.querySelector("#date").value;

            let dataModel = new DataModel(text, date);

            self.items.push(dataModel);

            //sort
            self.items.sort((a, b) => +a.date > +b.date);

            // find index
            let itemIndex = self.items.findIndex(obj => obj.date == dataModel.date);

            // insert row
            var newRow = self.table.querySelector("tbody").insertRow(itemIndex);
            newRow.insertCell(0).appendChild(document.createTextNode(dataModel.date));
            newRow.insertCell(1).appendChild(document.createTextNode(dataModel.text));
        })
    }
}