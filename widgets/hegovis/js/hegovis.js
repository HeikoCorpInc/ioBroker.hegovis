/*
    ioBroker.vis hegovis Widget-Set

    version: "0.0.1"

    Copyright 2020 HeikoCorpInc heikocorpinc@gmx.de
*/
"use strict";

// add translations for edit mode
$.extend( true, systemDictionary, {
        // Add your translations here, e.g.:
        // "size": {
        // 	"en": "Size",
        // 	"de": "Größe",
        // 	"ru": "Размер",
        // 	"pt": "Tamanho",
        // 	"nl": "Grootte",
        // 	"fr": "Taille",
        // 	"it": "Dimensione",
        // 	"es": "Talla",
        // 	"pl": "Rozmiar",
        // 	"zh-cn": "尺寸"
        // }
    }
);

// this code can be placed directly in hegovis.html
vis.binds["hegovis"] = {
    version: "0.0.1",
    showVersion: function () {
        if (vis.binds["hegovis"].version) {
            console.log('Version hegovis: ' + vis.binds["hegovis"].version);
            vis.binds["hegovis"].version = null;
        }
    },
	handleToggle: function (el, data) {

		var $this = $(el);
		var oid = data.oid;

		if (!vis.editMode) {
			var moved = false;
			$this.parent().on('click touchend', function () {
				if (vis.detectBounce(this)) return;
				if (moved) return;

				var val = vis.states[oid + '.val'];
				var type = data.iValueType;
				var valFalse = data.iValueFalse;
				var valTrue = data.iValueTrue;

				if(type == "boolean")
					vis.setValue(oid, !val);
				else{

					if(val == valFalse){
						if(!isNaN(valTrue))
							valTrue = parseFloat(valTrue);
						vis.setValue(oid, valTrue);
					}
					else{
						if(!isNaN(valFalse))
							valTrue = parseFloat(valFalse);
						vis.setValue(oid, valFalse);
					}
				}

			}).on('touchmove', function () {
				moved = true;
			}).on('touchstart', function () {
				moved = false;
			});

		}
		else{
			if(data.iButtonCol.charAt(0) === "{"){
				let str = (data.iButtonCol).substring(1,data.iButtonCol.length - 1);

			}
		}
	},
    createWidget: function (widgetID, view, data, style) {
        var $div = $('#' + widgetID);
        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds["hegovis"].createWidget(widgetID, view, data, style);
            }, 100);
        }

        var text = '';
        text += 'OID: ' + data.oid + '</div><br>';
        text += 'OID value: <span class="hegovis-value">' + vis.states[data.oid + '.val'] + '</span><br>';
        text += 'Color: <span style="color: ' + data.myColor + '">' + data.myColor + '</span><br>';
        text += 'extraAttr: ' + data.extraAttr + '<br>';
        text += 'Browser instance: ' + vis.instance + '<br>';
        text += 'htmlText: <textarea readonly style="width:100%">' + (data.htmlText || '') + '</textarea><br>';

        $('#' + widgetID).html(text);

        // subscribe on updates of value
        function onChange(e, newVal, oldVal) {
            $div.find('.template-value').html(newVal);
        }
        if (data.oid) {
            vis.states.bind(data.oid + '.val', onChange);
            //remember bound state that vis can release if didnt needed
            $div.data('bound', [data.oid + '.val']);
            //remember onchange handler to release bound states
            $div.data('bindHandler', onChange);
        }
    }
};

vis.binds["hegovis"].showVersion();