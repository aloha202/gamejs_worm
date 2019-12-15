function Worm(root) {

    this.root = root;
    this.matrix = [];
    this.divs = {};
    this.matrixSize = 15;
    this.wormStartLength = 4;

    this.FILLED_CLASS = 'matrix-filled';
    this.FILLED_CLASS_FOOD = 'matrix-filled-food';
    this.HAS_FOOD = false;

    this.direction = 'right';//possible: left , right, up , down
    this.nextDirection = this.direction;

    this.wormLength = this.wormStartLength;

    this.fillMatrix();

    this.drawMatrix();

    this.fitMatrix();

    var _this = this;

    $(window).resize(function () {
        _this.fitMatrix();
    });
    
}

Worm.prototype.fillMatrix = function () {

    for(var i = 0; i < this.matrixSize; i++)
    {
        for(var j = 0; j < this.matrixSize; j++){

            var value = 0;
            if(i == 0){
                if(j < this.wormStartLength){
                    value = j + 1;
                }
            }
            if(typeof this.matrix[i] == 'undefined'){
                this.matrix[i] = [];
            }
            this.matrix[i][j] = value;

        }
    }

}

Worm.prototype.drawMatrix = function () {

    for(var i = 0; i < this.matrix.length; i++){
        this.root.append(("<div class='matrix-row matrix-row-%i%'></div>").replace('%i%', i));
        var divI = this.root.find('.matrix-row-' + i);
        for(var j = 0; j < this.matrix[i].length; j++){
            var divJ = ("<div class='matrix-cell %filled-class% matrix-cell-%i%-%j%' data-value='%value%'></div>")
                .replace('%value%', this.matrix[i][j])
                .replace('%filled-class%', (this.matrix[i][j] > 0 ? this.FILLED_CLASS : ''))
                .replace('%i%', i)
                .replace('%j%', j);
            divI.append(divJ);
            this.divs[i + '_' + j] = this.root.find('.matrix-cell-' + i + '-' + j);
        }
        divI.append("<div class='clr'></div>")
    }

}

Worm.prototype.fitMatrix = function () {

    var w = Math.floor(Math.min($(window).height(), $(window).width()) / this.matrixSize);
    var rest = $(window).width() - ( w * this.matrixSize) ;
    this.root.find('.matrix-cell').css({
        width: w - 2,
        height: w - 2
    })
    this.root.css('margin-left', rest/2);
}
Worm.prototype.rebuildWorm = function () {
    for(var i = 0; i < this.matrixSize; i++) {
        for (var j = 0; j < this.matrix[i].length; j++) {
            this.divs[i + '_' + j].removeClass(this.FILLED_CLASS);
            this.divs[i + '_' + j].removeClass(this.FILLED_CLASS_FOOD);
            if(this.matrix[i][j] > 0){
                this.divs[i + '_' + j].addClass(this.FILLED_CLASS);
            }else if(this.matrix[i][j] < 0){
                this.divs[i + '_' + j].addClass(this.FILLED_CLASS_FOOD);
            }
        }
    }
}

Worm.prototype.setDirection = function (direction) {
    var imposibleDirections = [
        ['left', 'right'],
        ['right', 'left'],
        ['up', 'down'],
        ['down', 'up']
    ];
    for(var i in imposibleDirections){
        if(direction == imposibleDirections[i][0] && this.direction == imposibleDirections[i][1]){
            return;
        }
    }
    this.nextDirection = direction;
}
Worm.prototype.next = function () {
    this.direction = this.nextDirection;
    var maxValue = 0;
    var maxI = 0;
    var maxJ = 0;
    for(var i = 0; i < this.matrixSize; i++){
        for(var j = 0; j < this.matrix[i].length; j++){
            if(this.matrix[i][j] > maxValue){
                maxValue = this.matrix[i][j];
                maxI = i;
                maxJ = j;
            }
        }
    }

    var nextI = maxI;
    var nextJ = maxJ;
    if(this.direction == 'left'){
        nextJ = maxJ - 1;
    }else if(this.direction == 'right'){
        nextJ = maxJ + 1;
    }else if(this.direction == 'up'){
        nextI = maxI - 1;
    }else if(this.direction == 'down'){
        nextI = maxI + 1;
    }
    console.log(nextI + '_' + nextJ);

    if(nextI < 0 || nextI >= this.matrixSize || nextJ < 0 || nextJ >= this.matrixSize || this.matrix[nextI][nextJ] > 0){
        this.gameOver();
    }
    if(this.matrix[nextI][nextJ] != 0){//foooddd!
        maxValue += 1;// eat the foooodoooo!
        this.HAS_FOOD = false;
    }else{
        for(var i = 0; i < this.matrixSize; i++) {
            for (var j = 0; j < this.matrix[i].length; j++) {
                if(this.matrix[i][j] > 0) {
                    this.matrix[i][j] -= 1;
                }
            }
        }
    }

    this.matrix[nextI][nextJ] = maxValue;

    this.rebuildWorm();
}
Worm.prototype.getRandomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
Worm.prototype.addFood = function () {
    if(this.HAS_FOOD){
        return ;
    }
    var curI = this.getRandomInt(0, this.matrixSize - 1);
    var curJ = this.getRandomInt(0, this.matrixSize - 1);
    while(this.matrix[curI][curJ] != 0){
        curI = this.getRandomInt(0, this.matrixSize - 1);
        curJ = this.getRandomInt(0, this.matrixSize - 1);
    }
    this.matrix[curI][curJ] = -1;
    this.HAS_FOOD = true;
    this.rebuildWorm();
}

Worm.prototype.gameOver = function () {
    throw "Game Over";
}

