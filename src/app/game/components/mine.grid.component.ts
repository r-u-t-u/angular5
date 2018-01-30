import { Component, OnInit, Input } from "@angular/core";
import { MineModel } from "../mine";
import { OnChanges } from "@angular/core/src/metadata/lifecycle_hooks";

@Component({
    selector: 'mine-grid',
    templateUrl: '../templates/mine.grid.component.html',
    styleUrls: ['../../app.component.css']
})
export class MineGridComponent implements OnInit, OnChanges {
    @Input() gameWidth: number;
    @Input() gameHeight: number;
    @Input() gameBombs: number;
    private gameArray;
    private gameArrayClickable;
    private gameArrayMineValue;
    private gameLost: boolean = false;
    private gameWon: boolean = false;

    ngOnInit() {
        this.initGame();
    }

    initGame() {
        this.gameArrayClickable = [];
        this.gameArray = [];
        this.gameArrayMineValue = [];
        this.initClickableArray();
        this.initGameMines();
        this.initGameMineValue();
    }

    ngOnChanges() {
        this.initGame();
    }

    initGameMines() {

        let generateMines = this.gameBombs;
        let random_boolean;

        for (let i = 0; i < this.gameHeight; i++) {
            this.gameArray[i] = [];
            for (let j = 0; j < this.gameWidth; j++) {
                if (generateMines > 0) {
                    random_boolean = Math.random() >= 0.75;
                    this.gameArray[i][j] = random_boolean;
                    if (random_boolean) generateMines--;
                } else {
                    this.gameArray[i][j] = false;
                }
            }
        }
        //console.log(this.gameArray);
    }

    initClickableArray() {
        for (let i = 0; i < this.gameHeight; i++) {
            this.gameArrayClickable[i] = [];
            for (let j = 0; j < this.gameWidth; j++) {
                this.gameArrayClickable[i][j] = false;
            }
        }
    }

    initGameMineValue() {
        for (let i = 0; i < this.gameHeight; i++) {
            this.gameArrayMineValue[i] = [];
            for (let j = 0; j < this.gameWidth; j++) {
                this.gameArrayMineValue[i][j] = ' ';
            }
        }
    }

    endGame(mine: MineModel) {
        console.log('End Game');
        this.showAllMines();
        this.gameLost = true;
        //reset timer
        console.log(mine);
    }

    showAllMines() {
        for (let i = 0; i < this.gameHeight; i++) {
            for (let j = 0; j < this.gameWidth; j++) {
                if (this.gameArray[i][j]) {
                    this.gameArrayMineValue[i][j] = '*';
                }
                this.gameArrayClickable[i][j] = true;
            }
        }
        //console.log(this.gameArrayMineValue)
    }

    expandAround(mine: MineModel) {
        this.findRecursiveCount(mine.rowIndex, mine.colIndex);
        console.log(this.gameArray);
        console.log(this.gameArrayClickable);
        this.gameWon = this.checkForWin();
    }

    checkForWin(): boolean {
        let equalMatrix = true;
        for (let i = 0; i < this.gameHeight; i++) {
            for (let j = 0; j < this.gameWidth; j++) {
                if (!(this.gameArray[i][j] == !this.gameArrayClickable[i][j])) return false;
            }
        }
        return equalMatrix;
    }

    findRecursiveCount(i, j) {
        if (this.checkWithinGridBounds(i, j)) {
            //console.log('Recursive call ' + i + ' ' + j);
            this.gameArrayClickable[i][j] = true;
            let count = this.findMinesCountAround(i, j);
            this.gameArrayMineValue[i][j] = (count == 0) ? ' ' : count;
            if (count == 0) {

                if (this.checkWithinGridBounds(i + 1, j - 1) && !this.gameArrayClickable[i + 1][j - 1])
                    this.findRecursiveCount(i + 1, j - 1);

                if (this.checkWithinGridBounds(i + 1, j) && !this.gameArrayClickable[i + 1][j])
                    this.findRecursiveCount(i + 1, j);

                if (this.checkWithinGridBounds(i + 1, j + 1) && !this.gameArrayClickable[i + 1][j + 1])
                    this.findRecursiveCount(i + 1, j + 1);

                if (this.checkWithinGridBounds(i, j - 1) && !this.gameArrayClickable[i][j - 1])
                    this.findRecursiveCount(i, j - 1);

                if (this.checkWithinGridBounds(i, j + 1) && !this.gameArrayClickable[i][j + 1])
                    this.findRecursiveCount(i, j + 1);

                if (this.checkWithinGridBounds(i - 1, j - 1) && !this.gameArrayClickable[i - 1][j - 1])
                    this.findRecursiveCount(i - 1, j - 1);

                if (this.checkWithinGridBounds(i - 1, j) && !this.gameArrayClickable[i - 1][j])
                    this.findRecursiveCount(i - 1, j);

                if (this.checkWithinGridBounds(i - 1, j + 1) && !this.gameArrayClickable[i - 1][j + 1])
                    this.findRecursiveCount(i - 1, j + 1);
            }
        }
    }

    findMinesCountAround(i, j): number {
        let count = 0;
        if (this.checkWithinGridBounds(i + 1, j - 1) && this.gameArray[i + 1][j - 1])
            count++;

        if (this.checkWithinGridBounds(i + 1, j) && this.gameArray[i + 1][j])
            count++;

        if (this.checkWithinGridBounds(i + 1, j + 1) && this.gameArray[i + 1][j + 1])
            count++;

        if (this.checkWithinGridBounds(i, j - 1) && this.gameArray[i][j - 1])
            count++;

        if (this.checkWithinGridBounds(i, j + 1) && this.gameArray[i][j + 1])
            count++;

        if (this.checkWithinGridBounds(i - 1, j - 1) && this.gameArray[i - 1][j - 1])
            count++;

        if (this.checkWithinGridBounds(i - 1, j) && this.gameArray[i - 1][j])
            count++;

        if (this.checkWithinGridBounds(i - 1, j + 1) && this.gameArray[i - 1][j + 1])
            count++;

        return count;
    }

    checkWithinGridBounds(i: number, j: number): boolean {
        if (i < this.gameHeight && i >= 0 && j < this.gameWidth && j >= 0)
            return true;
        else
            return false;
    }
}