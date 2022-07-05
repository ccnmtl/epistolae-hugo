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
            this.field('senders');
            this.field('receivers');

            for (let doc of response) {
                this.add(doc);
                lookup[doc.uri] = doc;
            }
        });
    });

    let form = document.getElementById('search');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        search();
    }, false);

    function escapeSpaces(term) {
        return term.replaceAll(' ', '\\ ');
    }

    function search() {
        const searchText =
            document.getElementById('search-text').value.trim().toLowerCase();
        const recordType = document.getElementById('record-type').value;

        let query = `+type:${recordType}`;
        if (searchText) {
            query += ` +ititle:${searchText}~1`;
        }

        let sender = null;
        let receiver = null;
        if (recordType === 'letter') {
            sender = document.getElementById('select-by-sender').value;
            if (sender) {
                sender = escapeSpaces(sender);
                query += ` +senders:${sender}`;
            }
            receiver = document.getElementById('select-by-receiver').value;
            if (receiver) {
                receiver = escapeSpaces(receiver);
                query += ` +receivers:${receiver}`;
            }
        }

        // An empty search reloads the page, e.g. an implicit clear
        if (!searchText && !sender && !receiver) {
            window.location.reload();
            $('.list-pager-nav').show();
            return;
        }

        const results = index.search(query);
        populateTable(searchText, recordType, results);
        $('.list-pager-nav').hide();
    }

    function populateTable(searchText, recordType, results) {
        let target = document.querySelector('.search-result-container');

        while (target.firstChild) {
            target.removeChild(target.firstChild);
        }

        document.getElementById('record-count').textContent = results.length;

        let template = document.getElementById('search-result');
        for (let result of results) {
            let doc = lookup[result.ref];

            // Fill out search result template, adjust as needed.
            let elt = template.content.cloneNode(true);

            if (recordType === 'woman') {
                populateBiography(elt, doc);
            } else {
                populateLetter(elt, doc);
            }
            target.appendChild(elt);
        }

        if (results.length == 0) {
            $('#empty-search').show();
        } else {
            $('#empty-search').hide();
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

        let $senders = $(elt).find('.senders');
        for (let idx = 0; idx < doc.senders.length; idx++) {
            $('<a href="' + doc.senderIds[idx] + '">' +
                doc.senders[idx] +'</a>').appendTo($senders);
            if (idx < (doc.senders.length - 1)) {
                $('<span>, </span>').appendTo($senders);
            }
        }
        let $receivers = $(elt).find('.receivers');
        for (let idx = 0; idx < doc.receivers.length; idx++) {
            $('<a href="' + doc.senderIds[idx] + '">' +
                doc.receivers[idx] +'</a>').appendTo($receivers);
            if (idx < (doc.receivers.length - 1)) {
                $('<span>, </span>').appendTo($receivers);
            }
        }
    }

    function populateOptions(results) {
        let a = [];
        for (let result of results) {
            let doc = lookup[result.ref];
            a.push({'key': doc.title, 'value': doc.title});
        }
        return a;
    }

    $('#select-by-sender').selectize({
        placeholder: 'All Senders',
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
            const query = `+sender:true +ititle:${term}*`;
            const results = index.search(query);
            const opts = populateOptions(results);
            return callback(opts);
        },
        onChange: function(value) {
            search();
        }
    });

    $('#select-by-receiver').selectize({
        placeholder: 'All Receivers',
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
            const query = `+receiver:true +ititle:${term}*`;
            const results = index.search(query);
            const opts = populateOptions(results);
            return callback(opts);
        },
        onChange: function(value) {
            search();
        }
    });

}, false);