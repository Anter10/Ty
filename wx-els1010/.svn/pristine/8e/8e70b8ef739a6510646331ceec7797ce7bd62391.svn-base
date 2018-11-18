/**
 * 棋盘评分
 */
let TAG = '[tt.model.evaluate]';
class Evaluate{
    constructor(){
        this.board = [];
        this.blocks = tywx.tt.constants.Blocks;
        this.blockDis = tywx.tt.constants.BlockDis;
        this.maxDeep = 1;
        this.deepAddScore = 10;
        this.stepAddScore = 5;
        this.row = tywx.tt.constants.BoardHeight;
        this.col = tywx.tt.constants.BoardWidth;
    }
    static getInstance(){
        if(!Evaluate._instance) Evaluate._instance = new Evaluate();
        return Evaluate._instance;
    }
    initBoard(){
        this.board = [];
        for(let r = 0; r < this.row; ++r){
            let tmp_row = [];
            for(let c = 0; c < this.col; ++c){
                tmp_row.push(0);
            }
        }
    }
    outPutBoard(){
        for(let r = this.row - 1; r >= 0; --r){
            tywx.tt.log(TAG, this.board[r]);
        }
    }
    setMaxDeep(deep){
        this.maxDeep = deep;
    }
    getFillPosArray(tmp_board, block_idx){
        let ret = [];
        for(let r = 0; r < tmp_board.length; ++r){
            let tmp_row = tmp_board[r];
            for(let c = 0; c < tmp_row.length; ++c){
                let block_dis = this.blockDis[block_idx];
                let fill_num = 0;
                block_dis.forEach(e=>{
                    let [tr, tc] = [r + e[0], c + e[1]];
                    if(tr >= 0 && tr < this.row && tc >= 0 && tc < this.col && tmp_board[tr][tc] <= 0){
                        fill_num++;
                    }
                });
                if(fill_num === block_dis.length) ret.push([r,c]);
            }
        }
        return ret;
    }
    tmpFill(tmp_board, tr, tc, block_idx){
        let block_dis = this.blockDis[block_idx];
        block_dis.forEach(e=>{
            let [r, c] = [tr + e[0], tc + e[1]];
            //tywx.tt.log(TAG,'tmpFill', r, c, tmp_board);
            tmp_board[r][c] = 1;
        });
        return tmp_board;
    }
    deepCount(tmp_board, block_idx, deep, score){
        let s = score;
        let arr_pos = this.getFillPosArray(tmp_board, block_idx);
        let self = this;
        if(arr_pos.length > 0 && deep < this.maxDeep){
            arr_pos.forEach(e=>{
                let ret = self.tmpFill(tmp_board, e[0], e[1], block_idx);
                s += self.stepAddScore;
                for(let i = 0; i < self.blocks.length; ++i){
                    let b1 = self.cloneBoard(ret);
                    s += self.deepCount(b1, i, deep + 1, s);
                }
            });
            return s;
        }
        
        return 0;
    }
    formatArray(arr){
        let info = '';
        arr.forEach(e=>{
            info += `{${e[0]},${e[1]}}`;
        });
        return info;
    }
    cloneBoard(board){
        let ret = [];
        for(let r = 0; r < board.length; ++r){
            let row = board[r];
            let new_row = [];
            for(let c = 0; c < row.length; ++c){
                new_row[c] = row[c];
            }
            ret.push(new_row);
        }
        return ret;
    }
    evaluateByBoard(board){
        let ret = new Map();
        for(let i = 0; i < this.blocks.length; ++i){
            let b1 = this.cloneBoard(board);
            let score = this.deepCount(b1, i, 0, 0);
            ret.set(i, score);
        }
        return ret;
    }
}
Evaluate._instance = null;
module.exports = Evaluate;