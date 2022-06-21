window.addEventListener('DOMContentLoaded', function() {
    let index = null;
    let lookup = {};

    const reset = document.querySelector('button[type="reset"]');
    reset.addEventListener('click', () => {
        let href = window.location.href;
        window.location = href.replace(/page\/\d*\//, '');
    });

    // Load the search index
    $.getJSON('/search.json').done(function(response) {
        index = lunr(function() {
            this.ref('uri');

            // More searchable fields
            this.field('type');
            this.field('ititle');
            this.field('sender');
            this.field('receiver');

            for (let doc of response) {
                this.add(doc);
                lookup[doc.uri] = doc;
            }
        });
    });

    let form = document.getElementById('search');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const searchText = document.getElementById('search-text').value.trim();
        if (!searchText) {
            window.location.reload();
            return;
        }

        const params = {
            term: searchText.toLowerCase(),
            recordType: document.getElementById('record-type').value
        };
        const results = search(params);
        populateTable(params, results);
    }, false);

    function search(params) {
        const query = `+type:${params.recordType} +ititle:${params.term}`;
        return index.search(query);
    }

    function populateTable(params, results) {
        let target = document.querySelector('.search-result-container');

        while (target.firstChild) {
            target.removeChild(target.firstChild);
        }

        if (results.length == 0) {
            let searchResult = document.getElementById('search-result');
            searchResult.textContent = 
                `No results found for "${params.term}"`;
        }
        document.getElementById('record-count').textContent = results.length;

        let template = document.getElementById('search-result');
        for (let result of results) {
            let doc = lookup[result.ref];

            // Fill out search result template, adjust as needed.
            let elt = template.content.cloneNode(true);

            if (params.recordType === 'woman') {
                populateBiography(elt, doc);
            } else {
                populateLetter(elt, doc);
            }
            target.appendChild(elt);
        }
    }

    function populateBiography(elt, doc) {
        elt.querySelector('.woman-name').href = doc.uri;
        elt.querySelector('.woman-name').textContent = doc.title;
        elt.querySelector('.social-title').textContent = doc.social;
        elt.querySelector('.birth-date').textContent = doc.birth;
        elt.querySelector('.death-date').textContent = doc.death;
    }

    function populateLetter(elt, doc) {
        elt.querySelector('.letter-title').href = doc.uri;
        elt.querySelector('.letter-title').textContent = doc.title;
        elt.querySelector('.letter-date').textContent = doc.ltr_date;
        elt.querySelector('.senders').textContent = doc.senders.join(',');
        elt.querySelector('.receivers').textContent = doc.receivers.join(',');
    }


    $('#select-by-sender').selectize({
        valueField: 'key',
        labelField: 'value',
        searchField: 'value',
        create: false,
        onType: function(){
            this.renderCache = {};
            this.clearOptions();
            this.refreshOptions(true);
        },
        load: function (term, callback) {
            term = term.trim().toLowerCase();
            const query = `+sender:true +type:woman +ititle:${term}*`;
            const results = index.search(query);
            const opts = populateOptions(results);
            return callback(opts);
        }
    });

    $('#select-by-receiver').selectize({
        valueField: 'key',
        labelField: 'value',
        searchField: 'value',
        create: false,
        onType: function(){
            this.renderCache = {};
            this.clearOptions();
            this.refreshOptions(true);
        },
        load: function (term, callback) {
            term = term.trim().toLowerCase();
            const query = `+sender:true +type:woman +ititle:${term}*`;
            const results = index.search(query);
            const opts = populateOptions(results);
            return callback(opts);
        }
    });

    function populateOptions(results) {
        let a = [];
        for (let result of results) {
            let doc = lookup[result.ref];
            a.push({'key': doc.title, 'value': doc.title});
        }
        return a;
    }

}, false);