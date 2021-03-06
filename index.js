const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
//DATABASE DEFINITION
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "zoo",
    port: "3306"
});
//FIREWALL
app.use(function(req, res, next){
    if("key" in req.query){
        var key = req.query["key"];
        var query = "SELECT * FROM users WHERE apikey='" + key + "'";
        db.query(query, function(err, result, fields){
            if(err) throw err;
            if(result.length > 0){
                next();
            } else {
                res.status(403).send("Access denied");
            }
        });
    } else {
        res.status(403).send("Access denied");
    }
});
//ANIMALS
app.post('/animals', function(req, res){
    var name = req.body.name;
    var breed = req.body.breed;
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday;
    var entry_date = req.body.entry_date;
    var id_cage = req.body.id_cage;
    var query = "INSERT INTO animals (name,breed,food_per_day,birthday,entry_date,id_cage) VALUES ('" + name + "', '" + breed + "', " + food_per_day + ", '" + birthday + "','" + entry_date + "'," + id_cage + ")";
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.put('/animals/:id', function(req, res){
    console.log(req.params);
    var id = req.params.id;
    var query = "UPDATE animals SET ";
    for(var prop in req.body){
        query += prop;
        query += " = '" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length - 2);
    query += " WHERE id = " + id;
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.get('/animals', function(req, res){
    var query = "SELECT * FROM animals"
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    //FILTERING
    if("fields" in req.query){
        query = query.replace("*", req.query["fields"]);
    }
    //CONDITIONS
    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("WHERE") < 0){
                query += " WHERE";
            } else {
                query += " AND";
            }
            query += " " + conditions[index] + "='" +
                req.query[conditions[index]] + "'";
        }
    }
    //SORTING
    if("sort" in req.query){
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for(var index in sort){
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);
            query += " " + field;
            if(direction == "-")
                query += " DESC,";
            else
                query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    //PAGINATION
    if("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id', function(req, res){
    var id = req.params.id;
    var query = "SELECT * FROM animals WHERE id=" + id;
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    //FILTERING
    if("fields" in req.query){
        query = query.replace("*", req.query["fields"]);
    }
    //CONDITIONS
    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("WHERE") < 0){
                query += " WHERE";
            } else {
                query += " AND";
            }
            query += " " + conditions[index] + "='" +
                req.query[conditions[index]] + "'";
        }
    }
    //SORTING
    if("sort" in req.query){
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for(var index in sort){
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);
            query += " " + field;
            if(direction == "-")
                query += " DESC,";
            else
                query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    //PAGINATION
    if("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.delete('/animals', function(req, res){
    var query = "DELETE FROM animals";
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.delete('/animals/:id', function(req, res){
    var id = req.params.id;
    var query = "DELETE FROM animals WHERE id=" + id;
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
//FOOD
app.post('/food', function(req, res){
    var id = req.body.id;
    var name = req.body.name;
    var quantity = req.body.quantity;
    var id_animal = req.body.id_animal;
    var query = "INSERT INTO food (name,quantity,id_animal) VALUES ('" + name + "'," + quantity + "," + id_animal + ")";
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.put('/food/:id', function(req, res){
    console.log(req.params);
    var id = req.params.id;
    var query = "UPDATE food SET ";
    for(var prop in req.body){
        query += prop;
        query += " = '" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length - 2);
    query += " WHERE id = " + id;
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.get('/food', function(req, res){
    var query = "SELECT * FROM food"
    var conditions = ["name", "quantity", "id_animal"];
    //FILTERING
    if("fields" in req.query){
        query = query.replace("*", req.query["fields"]);
    }
    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("WHERE") < 0){
                query += " WHERE";
            } else {
                query += " AND";
            }
            query += " " + conditions[index] + "='" +
                req.query[conditions[index]] + "'";
        }
    }
    //SORTING
    if("sort" in req.query){
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for(var index in sort){
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);
            query += " " + field;
            if(direction == "-")
                query += " DESC,";
            else
                query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    //PAGINATION
    if("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/food/:id', function(req, res){
    var id = req.params.id;
    var query = "SELECT * FROM food WHERE id=" + id;
    var conditions = ["name", "quantity", "id_animal"];
    //FILTERING
    if("fields" in req.query){
        query = query.replace("*", req.query["fields"]);
    }
    //CONDITIONS
    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("WHERE") < 0){
                query += " WHERE";
            } else {
                query += " AND";
            }
            query += " " + conditions[index] + "='" +
                req.query[conditions[index]] + "'";
        }
    }
    //SORTING
    if("sort" in req.query){
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for(var index in sort){
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);
            query += " " + field;
            if(direction == "-")
                query += " DESC,";
            else
                query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    //PAGINATION
    if("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.delete('/food', function(req, res){
    var query = "DELETE FROM food";
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.delete('/food/:id', function(req, res){
    var id = req.params.id;
    var query = "DELETE FROM food WHERE id=" + id;
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
//STAFF
app.post('/staff', function(req, res){
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var wage = req.body.wage;
    var query = "INSERT INTO staff (firstname,lastname,wage) VALUES ( '" + firstname + "','" + lastname + "'," + wage + ")";
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.put('/staff/:id', function(req, res){
    var id = req.params.id;
    var query = "UPDATE staff SET ";
    for(var prop in req.body){
        query += prop;
        query += " = '" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length - 2);
    query += " WHERE id = " + id;
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.get('/staff', function(req, res){
    var query = "SELECT * FROM staff";
    var conditions = ["firstname", "lastname", "wage"];
    //FILTERING
    if("fields" in req.query){
        query = query.replace("*", req.query["fields"]);
    }
    //CONDITIONS
    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("WHERE") < 0){
                query += " WHERE";
            } else {
                query += " AND";
            }
            query += " " + conditions[index] + "='" +
                req.query[conditions[index]] + "'";
        }
    }
    //SORTING
    if("sort" in req.query){
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for(var index in sort){
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);
            query += " " + field;
            if(direction == "-")
                query += " DESC,";
            else
                query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    //PAGINATION
    if("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/staff/:id', function(req, res){
    var id = req.params.id;
    var query = "SELECT * FROM staff WHERE id=" + id;
    var conditions = ["firstname", "lastname", "wage"];
    //FILTERING
    if("fields" in req.query){
        query = query.replace("*", req.query["fields"]);
    }
    //CONDITIONS
    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("WHERE") < 0){
                query += " WHERE";
            } else {
                query += " AND";
            }
            query += " " + conditions[index] + "='" +
                req.query[conditions[index]] + "'";
        }
    }
    //SORTING
    if("sort" in req.query){
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for(var index in sort){
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);
            query += " " + field;
            if(direction == "-")
                query += " DESC,";
            else
                query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    //PAGINATION
    if("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.delete('/staff', function(req, res){
    var query = "DELETE FROM staff";
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.delete('/staff/:id', function(req, res){
    var id = req.params.id;
    var query = "DELETE FROM staff WHERE id=" + id;
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
//CAGES
app.post('/cages', function(req, res){
    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;
    var query = "INSERT INTO cages (name,description,area) VALUES ('" + name + "','" + description + "', " + area + ")";
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.put('/cages/:id', function(req, res){
    console.log(req.params);
    var id = req.params.id;
    var query = "UPDATE cages SET ";
    for(var prop in req.body){
        query += prop;
        query += " = '" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length - 2);
    query += " WHERE id = " + id;
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.get('/cages', function(req, res){
    var query = "SELECT * FROM cages";
    var conditions = ["name", "description", "area"];
    //FILTERING
    if("fields" in req.query){
        query = query.replace("*", req.query["fields"]);
    }
    //CONDITION
    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("WHERE") < 0){
                query += " WHERE";
            } else {
                query += " AND";
            }

            query += " " + conditions[index] + "='" +
                req.query[conditions[index]] + "'";

        }
    }
    //SORTING
    if("sort" in req.query){
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for(var index in sort){
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);
            query += " " + field;
            if(direction == "-")
                query += " DESC,";
            else
                query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    //PAGINATION
    if("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/cages/:id', function(req, res){
    var id = req.params.id;
    var query = "SELECT * FROM cages WHERE id=" + id;
    var conditions = ["name", "description", "area"];
    //FLITERING
    if("fields" in req.query){
        query = query.replace("*", req.query["fields"]);
    }
    //CONDITIONS
    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("WHERE") < 0){
                query += " WHERE";
            } else {
                query += " AND";
            }

            query += " " + conditions[index] + "='" +
                req.query[conditions[index]] + "'";

        }
    }
    //SORTING
    if("sort" in req.query){
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for(var index in sort){
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);
            query += " " + field;
            if(direction == "-")
                query += " DESC,";
            else
                query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    //PAGINATION
    if("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.delete('/cages', function(req, res){
    var query = "DELETE FROM cages";
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.delete('/cages/:id', function(req, res){
    var id = req.params.id;
    var query = "DELETE FROM cages WHERE id=" + id;
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

//FOOD STATS
app.get('/food-stats', function(req, res){
    var query = "SELECT a.id, IF(food_per_day =0,0,quantity/food_per_day) as days_left FROM animals a JOIN food f WHERE a.id = f.id_animal;"
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});


///RELATIONSHIPS
app.get('/cages/:id/animals', function(req, res){
    var id = req.params.id;
    var query = "SELECT animals.* FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id=" + id;
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    //CONDITIONS
    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("WHERE") < 0){
                query += " WHERE";
            } else {
                query += " AND";
            }
            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }
    //FILTERING
    if("fields" in req.query){
        query = query.replace("*", req.query["fields"]);
    }
    //PAGINATION
    if("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    }); 
});

app.get('/cages/:id_cage/animals/:id_animal', function(req, res){
    var id_cage = req.params.id_cage;
    var id_animal = req.params.id_animal;
    var query = "SELECT animals.* FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id =" + id_cage + " AND animals.id=" + id_animal;
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    //CONDITIONS
    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("WHERE") < 0){
                query += " WHERE";
            } else {
                query += " AND";
            }
            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }
    //FILTERING
    if("fields" in req.query){
        query = query.replace("*", req.query["fields"]);
    }
    //PAGINATION
    if("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id/cages', function(req, res){
    var id = req.params.id;
    var query = "SELECT cages.* FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE animals.id=" + id;
    var conditions = ["name", "description", "area"];
    //CONDITIONS
    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("WHERE") < 0){
                query += " WHERE";
            } else {
                query += " AND";
            }
            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }
    //FILTERING
    if("fields" in req.query){
        query = query.replace("*", req.query["fields"]);
    }
    //PAGINATION
    if("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id_animal/cages/:id_cage', function(req, res){
    var id_cage = req.params.id_cage;
    var id_animal = req.params.id_animal;
    var query = "SELECT cages.* FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id =" + id_cage + " AND animals.id=" + id_animal;
    var conditions = ["name", "description", "area"];
    //CONDITIONS
    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("WHERE") < 0){
                query += " WHERE";
            } else {
                query += " AND";
            }
            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }
    //FILTERING
    if("fields" in req.query){
        query = query.replace("*", req.query["fields"]);
    }
    //PAGINATION
    if("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id/food', function(req, res){
    var id = req.params.id;
    var query = "SELECT food.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id;
    var conditions = ["name", "quantity", "id_animal"];
    //CONDITIONS
    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("WHERE") < 0){
                query += " WHERE";
            } else {
                query += " AND";
            }
            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }
    //FILTERING
    if("fields" in req.query){
        query = query.replace("*", req.query["fields"]);
    }
    //PAGINATION
    if("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id_animal/food/:id_food', function(req, res){
    var id_animal = req.params.id_animal;
    var id_food = req.params.id_food;
    var query = "SELECT food.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id =" + id_animal + " AND food.id=" + id_food;
    var conditions = ["name", "quantity", "id_animal"];
    //CONDITIONS
    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("WHERE") < 0){
                query += " WHERE";
            } else {
                query += " AND";
            }
            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }
    //FILTERING
    if("fields" in req.query){
        query = query.replace("*", req.query["fields"]);
    }
    //PAGINATION
    if("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/food/:id/animals', function(req, res){
    var id = req.params.id;
    var query = "SELECT animals.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE food.id=" + id;
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    //CONDITIONS
    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("WHERE") < 0){
                query += " WHERE";
            } else {
                query += " AND";
            }
            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }
    //FILTERING
    if("fields" in req.query){
        query = query.replace("*", req.query["fields"]);
    }
    //PAGINATION
    if("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/query', function(req, res){
    res.send(JSON.stringify(req.query));
});

app.get('/food/:id_food/animals/:id_animal', function(req, res){
    var id_animal = req.params.id_animal;
    var id_food = req.params.id_food;
    var query = "SELECT animals.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id =" + id_animal + " AND food.id=" + id_food;
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("WHERE") < 0){
                query += " WHERE";
            } else {
                query += " AND";
            }
            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }
    if("fields" in req.query){
        query = query.replace("*", req.query["fields"]);
    }
    if("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

//DATABASE CONNECTION
app.listen(3000, function(){
    db.connect(function(err){
        if(err) throw err;
        console.log('Connection to database successful!');
    });
    console.log('Example app listening on port 3000!');
});