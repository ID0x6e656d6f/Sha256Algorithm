function sha(string) {
    var f = string;
    if (f.length < 9223372036854776000) {//numero massimo rappresentabile con potenza di 64 per i bit
        var f2 = "";
        for (var i = 0; i < f.length; i++) { //converto ogni carattere in decimale ponendo dei divisori in ogni letter
            f2 += f.charCodeAt(i) + "-";
        }
        var bitChiave = "";
        var tmpSum = 0;
        var tmpStr = "";
        for (var x = 0; x < f2.length; x++) { //qui leggo la stringa in decimale, per poi convertire ogni cifra in binario e concatenarla
            if (f2[x] != '-') {
                tmpStr += f2[x];
            }
            else {
                for (var i = 7; i >= 0; i--) {
                    var pow = parseInt((Math.pow(2, i)));    //conversione da decimale a binario
                    if (pow + tmpSum > parseInt(tmpStr)) {
                        bitChiave += "0";
                    }
                    else if (pow + tmpSum <= parseInt(tmpStr)) {
                        bitChiave += "1";
                        tmpSum += pow;
                    }
                }
                tmpStr = "";
                tmpSum = 0; //resetto le variabili usate per convertire quel numero
                bitChiave += "";
            }
        }
        var lenghStartMessage = bitChiave.length; //salvo la lunghezza originale in bit del messaggio, per aggiugnerlo alla fine in binario con 64 bit
        bitChiave += "1"; //aggiungo bit di messaggio 1
        while (bitChiave.length % (512 - 64) != 0) { //aggiungo gli 0 di padding, fino a far arrivare la lunghezza del tutto
            bitChiave += "0";                        //ad un multiplo di 512-64, quindi 448.
        }
        //document.write(bitChiave + "<br>");
        //document.write(bitChiave.length + "<br>");
        var tmpSum = 0;                             //qui è più una sega, allora: prendo la lunghezza del messaggio originale in binario
        for (var x = 63; x >= 0; x--) {             //creo una stringa da 64 bit, da 0 a 63, che rappresenta la lunghezza originale
            var pow = parseInt((Math.pow(2, x)));   //del messaggio in binario e la metto in fondo alla mia stringa di multiplo di 512-64
            if (pow + tmpSum > lenghStartMessage) {              //così ho un multiplo di 512
                bitChiave += "0";
            }
            else if (pow + tmpSum <= lenghStartMessage) {
                bitChiave += "1";
                tmpSum += pow;
            }
        }
        //document.write(bitChiave + "<br>");
        //document.write(bitChiave.length + "<br>");

        /*VARIABILI E VALORI HASH (H)*/ //le prime h sono i primi 32 bit delle parti frazionarie delle radici quadrate 
        const h0 = 0x6a09e667;          //dei primi 8 numeri primi
        const h1 = 0xbb67ae85;
        const h2 = 0x3c6ef372;
        const h3 = 0xa54ff53a;
        const h4 = 0x510e527f;
        const h5 = 0x9b05688c;          //le k invece sono i valori a 32 bit delle parti frazionarie delle radici cubiche
        const h6 = 0x1f83d9ab;          //dei primi 64 numeri primi
        const h7 = 0x5be0cd19;
        const k = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];

        /*ciclo di blocchi*/
        const block512Chunck = bitChiave.length / 512; //questa variabile mi serve per registrare quanti                                           
        var tmpContatore32 = 0;                        //blocchi da 512 bit ho nel mio messagio, il che mi servirà
        var tmp32bit = "";                             //per il passaggio successivo
        var w = [];
        var contPosArr = 0;
        for (var j = 0; j < block512Chunck; j++) {
            for (var i = 0; i < bitChiave.length; i++) {      //qui creo un array suddiviso in blocchi da 32 bit, presi
                if (tmpContatore32 < 32) {                    //spezzettando il numero da 512 bit (in questo caso) 
                    tmpContatore32++;                         //ricavato nel primo passsaggio
                    tmp32bit += bitChiave[i];
                }
                if (tmpContatore32 == 32) {
                    w[contPosArr] = tmp32bit;
                    tmp32bit = "";
                    contPosArr++;
                    tmpContatore32 = 0;
                }
            }
        }

        for (var i = w.length; i < 64; i++) {
            w[i] = "00000000000000000000000000000000";
        }
        var s0 = "";
        var s1 = "";
        var str = 0;
        var str2 = 0;

        for (var i = 16; i < w.length; i++) {
            str = w[i - 15];
            //document.write(str + "<br><br>");
            var app1 = rightRotate(7, str);
            //document.write(app1 + "<br>");

            var app2 = rightRotate(18, str);
            //document.write(app2 + "<br>");

            var app3 = (parseInt(str, 2) >> 3);
            app3 = b2s(app3);
            //document.write(app3 + "<br><br><br><br>");

            s0 = (BigInt(parseInt(app1, 2)) ^ BigInt(parseInt(app2, 2))) ^ BigInt(parseInt(app3, 2));
            //document.write(s0 + " --- " + b2s(s0));


            str2 = w[i - 2];
            var app4 = rightRotate(17, str2);
            //document.write(app4 + "<br>");

            var app5 = rightRotate(19, str2);
            //document.write(app5 + "<br>");

            var app6 = (parseInt(str2, 2) >> 10);
            app6 = b2s(app6);
            //document.write(app6 + "<br>");


            s1 = (BigInt(parseInt(app4, 2)) ^ BigInt(parseInt(app5, 2))) ^ BigInt(parseInt(app6, 2));
            //document.write(s1 + " --- " + b2s(s1));
            if (i < w.length)
                w[i] = ((parseInt(w[i - 16], 2) + parseInt(b2s(s0), 2) + parseInt(w[i - 7], 2) + parseInt(b2s(s1), 2)) % (Math.pow(2, 32))).toString(2);
            else
                break;
        }
        var a = b2s(h0);
        var b = b2s(h1);
        var c = b2s(h2);
        var d = b2s(h3);
        var e = b2s(h4);
        var f = b2s(h5);
        var g = b2s(h6);
        var h = b2s(h7);
        var s1 = "";
        var s0 = "";
        var ch = "";
        var temp1 = "";
        var temp2 = "";
        var maj = "";
        for (var i = 0; i <= 63; i++) {
            s1 = b2s((BigInt(parseInt(rightRotate(6, e), 2)) ^ BigInt(parseInt(rightRotate(11, e), 2))) ^ BigInt(parseInt(rightRotate(25, e), 2)));

            ch = b2s((BigInt(parseInt(e, 2)) & BigInt(parseInt(f, 2))) ^ (~BigInt(parseInt(e, 2)) & BigInt(parseInt((g), 2))));

            temp1 = b2s((parseInt(h, 2) + parseInt(s1, 2) + parseInt(ch, 2) + parseInt(b2s(k[i]), 2) + parseInt(w[i], 2)) % (Math.pow(2, 32))).toString(2);


            s0 = b2s((BigInt(parseInt(rightRotate(2, a), 2)) ^ BigInt(parseInt(rightRotate(13, a), 2))) ^ BigInt(parseInt(rightRotate(22, a), 2)));

            maj = b2s((BigInt(parseInt(a, 2)) & BigInt(parseInt(b, 2))) ^ (BigInt(parseInt(a, 2)) & BigInt(parseInt(c, 2))) ^ (BigInt(parseInt(b, 2)) & BigInt(parseInt(c, 2))));

            temp2 = b2s((parseInt(s0, 2) + parseInt(maj, 2)) % (Math.pow(2, 32))).toString(2);
            h = g;
            g = f;
            f = e;
            e = b2s((parseInt(d, 2) + parseInt(temp1, 2)) % (Math.pow(2, 32))).toString(2);
            d = c;
            c = b;
            b = a;
            a = b2s((parseInt(temp1, 2) + parseInt(temp2, 2)) % (Math.pow(2, 32))).toString(2);
        }
        h00 = parseInt(parseInt(b2s(h0), 2) + parseInt(a, 2)).toString(16);
        h01 = parseInt(parseInt(b2s(h1), 2) + parseInt(b, 2)).toString(16);
        h02 = parseInt(parseInt(b2s(h2), 2) + parseInt(c, 2)).toString(16);
        h03 = parseInt(parseInt(b2s(h3), 2) + parseInt(d, 2)).toString(16);
        h04 = parseInt(parseInt(b2s(h4), 2) + parseInt(e, 2)).toString(16);
        h05 = parseInt(parseInt(b2s(h5), 2) + parseInt(f, 2)).toString(16);
        h06 = parseInt(parseInt(b2s(h6), 2) + parseInt(g, 2)).toString(16);
        h07 = parseInt(parseInt(b2s(h7), 2) + parseInt(h, 2)).toString(16);

        var digest = h00 + h01 + h02 + h03 + h04 + h05 + h06 + h07;
        return digest;
    }

    else {
        alert("Testa di sedere sei serio? Chi ti crede che devi scrivere un messaggio così lungo? Mica sei gesù...stai con i piedi per terra rincoglionito")
    }
}

function b2s(st) { //mi serve per avere una stinga da 32 bit
    var bitChiave = "";
    var tmpSum = 0;
    for (var i = 31; i >= 0; i--) {
        var pow = parseInt((Math.pow(2, i)));    //conversione da decimale a binario
        if (pow + tmpSum > parseInt(st)) {
            bitChiave += "0";
        }
        else if (pow + tmpSum <= parseInt(st)) {
            bitChiave += "1";
            tmpSum += pow;
        }
    }
    return bitChiave;
}


function rightRotate(s, s0) {
    var last = 0;
    var arr = [];
    for (var i = 0; i < s0.length; i++) {
        arr[i] = s0[i];
    }
    for (var i = 0; i < s; i++) {
        for (var j = arr.length - 1; j > 0; j--) {

            if (j == arr.length - 1) { last = arr[j]; }

            if (j == 1) { arr[j] = arr[j - 1]; arr[j - 1] = last; }

            else { arr[j] = arr[j - 1]; }
        }
    }
    var digestFinal = "";
    for (var i = 0; i < arr.length; i++) {
        digestFinal = digestFinal.concat(arr[i]);
    }

    return digestFinal;//final return
}

function isLtEn() {/* questa parte serve per verificare il tipo di struttura hardware, se è big o little endian */
    var isLittleEndian = true;
    (() => {
        var buf = new ArrayBuffer(4);
        var buf8 = new Uint8ClampedArray(buf);
        var data = new Uint32Array(buf);
        data[0] = 0x0F000000;
        if (buf8[0] === 0x0f) {
            isLittleEndian = false;
        }
    })();
    document.write("Is little endian your hardware: " + isLittleEndian + "");
}
