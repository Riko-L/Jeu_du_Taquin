function loadData(data) {
    for (i = 0; i < data.length; i++) {
        if (data[i] == 9) {
            $("#data_" + i).html(" ");
            $("#data_" + i).css("background-color", "cadetblue");
        } else {
            $("#data_" + i).html(data[i]);
            $("#data_" + i).css("background-color", "darkmagenta");
        }
    }
    data_table = data.concat();
    console.log("Data loaded => " + data)
}


function randomData(data) {
    var length = data.length;
    var newData = [];
    while (newData.length != length) {
        var i = Math.floor(Math.random() * Math.floor(data.length));
        newData.push(data[i]);
        data.splice(i, 1);
    }
    loadData(newData);
    return newData;
}

function isResolvable() {

    var counter = 0;
    for (i = 0; i < data_table.length; ++i) {

        if (data_table[i] != 9) {
            for (j = i + 1; j < data_table.length; ++j) {
                if (isBigger(i, j) && data_table[j] != 9) {
                    counter++;
                }
            }
        }
    }
    return {
        "counter": counter,
        "resolvable": counter % 2 == 0 ? true : false
    }
}

function swap(A, B) {
    var tmp = data_table[A];
    data_table[A] = data_table[B];
    data_table[B] = tmp;
}

function isBigger(A, B) {
    return data_table[A] > data_table[B];
}


function resolve() {

    var origin;

    for (i = 0; i < data_table.length; ++i) {
        if (data_table[i] == 9) {
            origin = i;
            break;
        }
    }

    search_dsf(origin, 0, -1);

    for (i = 0; i < best_depth; ++i) {
        console.log("move[" + i + "] = " + best_moves[i]);
    }

}

function isCorrect() {

    for (i = 0; i < data_table.length; ++i) {
        if (data_table[i] != data_init[i])
            return false;
    }

    return true;
}

function search_dsf(origin, depth, played) {

    if (depth >= best_depth) {
        return;
    }

    if (depth != 0) {
        move[depth - 1] = data_table[played];
    }

    if (isCorrect()) {
        console.log("Solution trouvé avec : [" + depth + "] déplacements");
        best_depth = depth;

        for (i = 0; i < depth; ++i) {
            best_moves[i] = move[i];
        }
        return true;
    }

    var left = origin + 1;
    var right = origin - 1;
    var up = origin - 3;
    var down = origin + 3;

       if (left == played) left = -1;
       if (right == played) right = -1;
       if (up == played) up = -1;
       if (down == played) down = -1;

    if (left > 0 && left < data_table.length) {
        swap(origin, left);
        //  console.log("LEFT "  + data_table + " depth >> " + depth);
        search_dsf(left, ++depth, origin)
        swap(origin, left);
        //  console.log("LEFT "  + data_table + " depth >> " + depth);
    }
    if (right > 0 && right < data_table.length) {
        swap(origin, right);
        //  console.log("RIGHT "  + data_table + " depth >> " + depth);
         search_dsf(right, ++depth, origin)

        swap(origin, right);
        //  console.log("RIGHT "  + data_table + " depth >> " + depth);
    }
    if (up > 0 && up < data_table.length) {
        swap(origin, up);
        //  console.log("UP "  + data_table + " depth >> " + depth);
        search_dsf(up, ++depth, origin)
        swap(origin, up);
        //   console.log("UP "  + data_table + " depth >> " + depth);
    }
    if (down > 0 && down < data_table.length) {
        swap(origin, down);
        //   console.log("DOWN "  + data_table + " depth >> " + depth);
        search_dsf(down, ++depth);
        swap(origin, down);
        //   console.log("DOWN "  + data_table + " depth >> " + depth);
    }
}


$(document).ready(function () {

    MAX_DEPTH = 50;
    move = new Array(MAX_DEPTH);
    best_moves = new Array(MAX_DEPTH);
    best_depth = MAX_DEPTH;

    data_init = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    data_table = data_init.concat();


    data_table = [1, 2, 3, 9, 5, 6, 4, 7, 8] ;//randomData(data_table);

    loadData(data_table);

    while (!isResolvable().resolvable) {
        data_table = randomData(data_table);
    }



    $('#random_btn').on('click', function () {
        data_table = randomData(data_table);
    });

    $('#init_btn').on('click', function () {
        loadData(data_init);
    });

    $('#resolve_btn').on('click', function () {
        resolve();
    });

    $('#resolvable_btn').on('click', function () {
        var response = isResolvable()
        var counter = response.counter;
        var resolvable = response.resolvable;
        if (resolvable) {
            $('body > #jeu_taquin').prepend(`<div class="info_val">Il y a une solution possible <p> il y a ${counter} pairs inversées</p></div>`);
            setTimeout(function () {
                $('.info_val').remove();
            }, 2000)
        } else {
            $('body > #jeu_taquin').prepend(`<div class="info_war">Attention pas de solution possible</div>`);
            setTimeout(function () {
                $('.info_war').remove();
            }, 2000)
        }
    });


    $('#t_taquin td')
        .mouseenter(function (e) {
            $(this).css("background-color", "blue");
        })
        .mouseleave(function (e) {
            $(this).css("background-color", "darkmagenta");
            if ($(this).html() == " ") {
                $(this).css("background-color", "cadetblue");
            }
        });

    $('#resolvable_btn').trigger('click');





});