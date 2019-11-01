$( document ).ready(function() {
    var FIELD_NROWS = 20;
    var FIELD_NCOLS = 11;

    var file_extensions = [
        "7z",
        "ai",
        "aiff",
        "nfs",
        "ani",
        "apl",
        "app",
        "arff",
        "arrow",
        "ash",
        "asp",
        "aspx",
        "avi",
        "bas",
        "bat",
        "beam",
        "bib",
        "bik",
        "bin",
        "bmp",
        "cab",
        "cad",
        "cc",
        "cgi",
        "chk",
        "chm",
        "class",
        "cmd",
        "cmp",
        "coffee",
        "com",
        "cpp",
        "css",
        "csv",
        "dat",
        "dmg",
        "doc",
        "dwg",
        "emf",
        "epub",
        "exe",
        "gif",
        "gz",
        "htm",
        "html",
        "ico",
        "img",
        "ini",
        "ipynb",
        "java",
        "jay",
        "jpeg",
        "jpg",
        "js",
        "key",
        "lnk",
        "lsp",
        "lua",
        "lzw",
        "map",
        "md5",
        "mdf",
        "mk",
        "mp3",
        "mp4",
        "mpeg",
        "msi",
        "nb",
        "nfo",
        "nrg",
        "obj",
        "otf",
        "odb",
        "ogg",
        "pak",
        "pdb",
        "pdf",
        "php",
        "pkl",
        "pl",
        "png",
        "prj",
        "psp",
        "py",
        "qt",
        "rar",
        "raw",
        "rpm",
        "rtf",
        "sas",
        "scala",
        "sh",
        "sql",
        "swf",
        "swp",
        "tex",
        "tiff",
        "txt",
        "u3o",
        "ufo",
        "ump",
        "url",
        "vid",
        "vob",
        "vrml",
        "war",
        "wav",
        "wmf",
        "xls",
        "xlsx",
        "xmf",
        "xml",
        "xslt",
        "yaml",
        "yml",
        "zip",
    ];

    var prepare_wordsmap = function(extensions) {
        var wordsmap = new Map();
        for (const ext of extensions) {
            for (i = 0; i < ext.length; i++) {
                var letter = ext[i];
                if (!wordsmap.has(letter)) {
                    wordsmap.set(letter, []);
                }
                var wm = {
                    left:  i,
                    right: ext.length - 1 - i,
                    word:  ext
                };
                wordsmap.get(letter).push(wm);
            }
        }
        return wordsmap;
    };

    var all_solved = function() {
        var $rows = $("table.field tr:visible");
        var $correct_rows = $("table.field tr.correct");
        return $rows.length === $correct_rows.length;
    };

    var generate_challenge = function(name, wordsmap) {
        var challenge = {
            name: name,
            words: [],
        };
        for (var i = 0; i < name.length; i++) {
            var letter = name[i];
            var a = wordsmap.get(letter);
            var question = a[Math.floor(Math.random() * a.length)];
            challenge.words.push(question);
        }
        return challenge;
    };

    var focus_next_input = function($td) {
        if (!$td.find("input").val()) return;
        var $td_next = $td.next();
        if ($td_next.hasClass("center")) {
            $td_next = $td_next.next();
        }
        if ($td_next.hasClass("hidden")) {
            $td_next = $td_next.parent().next()
                        .find("td:not(.hidden):not(.center)").first();
        }
        $td_next.find("input").focus().select();
    };

    var find_entered_word = function($row) {
        var word = "";
        $row.find("td:not(.hidden)").each(function(){
            if ($(this).hasClass("center")) {
                word += $(this).text();
            } else {
                var letter = $(this).find("input").val();
                if (!letter) {
                    letter = "_";
                }
                word += letter;
            }
        });
        return word;
    };

    var word_is_complete = function(word) {
        return !word.includes("_");
    };

    var word_is_legal = function(word) {
        return file_extensions.includes(word);
    };

    var setup_field = function(challenge) {
        var name = challenge.name;
        for (var i = 0; i < name.length; i++) {
            var nleft = challenge.words[i].left;
            var nright = challenge.words[i].right;
            var row = $(".row" + (i+1));
            row.show();
            row.find(".center").text(name[i]);
            for (var j = 0; j < (FIELD_NCOLS - 1)/2; j++) {
                var leftcell = row.find(".left" + (j+1));
                var rightcell = row.find(".right" + (j+1));
                leftcell.toggleClass("hidden", j >= nleft);
                rightcell.toggleClass("hidden", j >= nright);
            }
        }
        for (var i = name.length; i < FIELD_NROWS; i++) {
            $(".row" + (i+1)).hide();
        }
        $(".field input").keyup(function() {
            var $td = $(this).parent();
            var $tr = $td.parent();
            focus_next_input($td);
            var word = find_entered_word($tr);
            $tr.removeClass("correct").removeClass("incorrect");
            if (word_is_complete(word)) {
                if (word_is_legal(word)) {
                    $tr.addClass("correct");
                    if (all_solved()) {
                        $("table.field").addClass("solved")
                                        .find("input").blur();
                    }
                } else {
                    $tr.addClass("incorrect");
                }
            }
        });
    };

    var wordsmap = prepare_wordsmap(file_extensions);
    var challenge = generate_challenge("victor", wordsmap);

    setup_field(challenge);

    console.log(wordsmap);

    console.log(challenge);
});
