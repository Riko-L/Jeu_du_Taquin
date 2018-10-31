function loadData(data) {
    for (i = 0; i < data.length; i++) {
        if (data[i] == 9) {
            $("#data_" + i).html(" ");
            $("#data_" + i).attr('data-index', i);
            $("#data_" + i).css("visibility", "visible");
        } else {
            $("#data_" + i).html(`<img class="imgLogo cover" id="img_${i}" src="/img/${data[i]}.jpg"/> `);
            $("#data_" + i).attr('data-index', i);
            $("#data_" + i).css("visibility", " visible");
        }
    }
    data_table = data;
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

function swap(data, A, B) {
    var tmp = data[A];
    data[A] = data[B];
    data[B] = tmp;
}

function isBigger(A, B) {
    return data_table[A] > data_table[B];
}

function resolve(data, data_goal) {
    var MAX_DEPTH = 100;
    move = new Array(MAX_DEPTH);
    best_moves = new Array(MAX_DEPTH);
    best_depth = MAX_DEPTH;

    var origin;
    var depth = 0;
    var results = [];
    for (i = 0; i < data.length; ++i) {
        if (data[i] == 9) {
            origin = i;
            break;
        }
    }

    
    var promise1 = new Promise(function (resolve, reject) {
            $('body > #jeu_taquin').prepend(`<div class="info_val">Recherche d'une solution</p></div>`);
            setTimeout(function() {
                search_dsf(data, data_goal, origin, depth, -1);
                resolve();
            }, 500)
    });


    promise1.then(function () {
        $('.info_val').remove();
        for (i = 0; i < best_depth; ++i) {
            console.log("move[" + i + "] = " + best_moves[i]);
            results.push(best_moves[i]);
        }
    })
    

    return results;
}

function isCorrect(data, data_goal) {

    for (i = 0; i < data.length; ++i) {
        if (data[i] != data_goal[i])
            return false;
    }

    return true;
}

function search_dsf(data, data_goal, origin, depth, played) {


    if (depth >= best_depth) {
        return;
    }

    if (depth != 0) {
        move[depth - 1] = data[played];
    }

    if (isCorrect(data, data_goal)) {
        console.log("Solution trouvé avec : [" + depth + "] déplacements");
        best_depth = depth;

        for (i = 0; i < depth; ++i) {
            best_moves[i] = move[i];
        }
        return true;
    }

    var left = origin - 1;
    var right = origin + 1;
    var up = origin - 3;
    var down = origin + 3;

    if (left == played) left = -1;
    if (right == played) right = -1;
    if (up == played) up = -1;
    if (down == played) down = -1;

    if (left >= 0 && left <= data.length && left % 3 != 2) {
        swap(data, origin, left);
        //  console.log("LEFT "  + data_table + " depth >> " + depth);
        search_dsf(data, data_goal, left, depth + 1, origin)
        swap(data, origin, left);
        //  console.log("LEFT "  + data_table + " depth >> " + depth);
    }
    if (right >= 0 && right <= data.length && right % 3 != 0) {
        swap(data, origin, right);
        //  console.log("RIGHT "  + data_table + " depth >> " + depth);
        search_dsf(data, data_goal, right, depth + 1, origin)

        swap(data, origin, right);
        //  console.log("RIGHT "  + data_table + " depth >> " + depth);
    }
    if (up >= 0 && up <= data.length - 1) {
        swap(data, origin, up);
        //  console.log("UP "  + data_table + " depth >> " + depth);
        search_dsf(data, data_goal, up, depth + 1, origin)
        swap(data, origin, up);
        //   console.log("UP "  + data_table + " depth >> " + depth);
    }
    if (down >= 0 && down <= data.length - 1) {
        swap(data, origin, down);
        //   console.log("DOWN "  + data_table + " depth >> " + depth);
        search_dsf(data, data_goal, down, depth + 1, origin);
        swap(data, origin, down);
        //   console.log("DOWN "  + data_table + " depth >> " + depth);
    }
}

function swapElement(el) {
    var origin;
    var index = el.data('index');

    for (i = 0; i < data_table.length; i++) {
        if (data_table[i] == 9) {
            origin = i;
            break;
        }
    }
    var left = origin - 1;
    var right = origin + 1;
    var up = origin - 3;
    var down = origin + 3;


    if (index == left && left >= 0 && left <= data_table.length && left % 3 != 2 ||
        index == right && right >= 0 && right <= data_table.length && right % 3 != 0 ||
        index == up && up >= 0 && up <= data_table.length - 1 ||
        index == down && down >= 0 && down <= data_table.length - 1) {

        swap(data_table, origin, index);
    }

    loadData(data_table);

    return data_table;

}

$(document).ready(function () {
    auto = false;
    var data_init = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var data_table = data_init.concat();
    data_table = randomData(data_table);

    while (!isResolvable().resolvable) {
        data_table = randomData(data_table);
    }

    $('#random_btn').on('click', function () {
        data_table = randomData(data_table);
        while (!isResolvable().resolvable) {
            data_table = randomData(data_table);
        }
        auto = false;
        $('#resolvable_btn').trigger('click');
    });

    $('#init_btn').on('click', function () {
        auto = false;
        // TODO change data init
        loadData(data_init.concat());
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


    $('#t_taquin td').on('click', function () {
        data_table = swapElement($(this));
        if (!auto && isCorrect(data_table, data_init)) {
            $('body > #jeu_taquin').prepend(`<div class="info_val">Le jeu à été résolu </p></div>`);
            setTimeout(function () {
                $('.info_val').remove();
            }, 2000)
        }
    });


    $('#resolve_btn').on('click', function () {
        auto = true;
        console.log(data_table);

        var results = resolve(data_table, data_init);

        let i = 0;
        let stop = setInterval(function () {
            $('#data_' + data_table.indexOf(results[i])).trigger('click');
            i++
            if (i === results.length) {
                clearInterval(stop);
                $('body > #jeu_taquin').prepend(`<div class="info_val">Le jeu à été résolu </p></div>`);
                auto = false;
                setTimeout(function () {
                    $('.info_val').remove();
                }, 2000)
            }
        }, 500);
    });




    $('#resolvable_btn').trigger('click');

});