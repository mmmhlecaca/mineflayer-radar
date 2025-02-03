(function() {
  var io = window.io
    , socket = io.connect()
    , canvas = document.getElementById('canvas')
    , context = canvas.getContext('2d')
    , drawInterval = setInterval(draw, 50)
    , botEntity
    , entities = {}

  socket.on('entity', function (newEntity) {
    botEntity = newEntity;
  });

  socket.on('entitySpawn', function (newEntity) {
    entities[newEntity.id] = newEntity;
  });

  socket.on('entityMoved', function (newEntity) {
    entities[newEntity.id] = newEntity;
  });

  socket.on('entityGone', function(oldEntity) {
    delete entities[oldEntity.id];
  });

  var white = '#ffffff'
    , black = '#000000'
    , imgArrow = new Image()
    , imgBlueArrow = new Image()
    , imgRedArrow = new Image()
    , w = canvas.width
    , h = canvas.height
    , centerX = w / 2
    , centerY = h / 2
    , xFromMc = w / 100
    , yFromMc = h / 100

  imgArrow.src = '/arrow.png';
  imgBlueArrow.src = '/arrow-blue.png';
  imgRedArrow.src = '/arrow-red.png';

  function draw() {
    if (!botEntity) return;

    // fill the canvas with black
    context.fillStyle = black;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the bot entity's arrow at the center
    context.save();
    context.translate(centerX, centerY);
    context.rotate(1.5 * Math.PI - botEntity.yaw);
    context.drawImage(imgArrow, 0, 0, 12, 12, -6, -6, 12, 12);
    context.restore();

    // Draw entities (only players)
    for (var entityId in entities) {
      var entity = entities[entityId];

      // Check if this entity is a player (by checking for a username)
      if (entity.username) {
        var x = centerX + xFromMc * (entity.position.x - botEntity.position.x);
        var y = centerY + yFromMc * (entity.position.z - botEntity.position.z);
        
        context.save();
        context.translate(x, y);
        context.rotate(1.5 * Math.PI - entity.yaw);
        context.drawImage(imgBlueArrow, 0, 0, 12, 12, -6, -6, 12, 12);
        context.restore();

        // Draw player username
        context.fillStyle = white;
        context.textBaseline = 'center';
        context.fillText(entityText(entity), x, y - 20);
      }
    }
  }

  // Function to display entity info (like username)
  function entityText(entity) {
    return entity.username || '';  // Only show the username for players
  }

}());
