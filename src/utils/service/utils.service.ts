export class UtilsService {
  static generateRandomInteger(long: number): number {
    return Math.floor(10 ** (long - 1) + Math.random() * 9 * 10 ** (long - 1));
  }

  static changeDateToIndonesianFormat(
    date: Date,
    options?: Partial<{
      withYear: boolean;
      withMonth: boolean;
      withDay: boolean;
      withDate: boolean;
    }>,
  ): string {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const tanggal = date?.getDate();
    const day = date?.getDay();

    let bulan: string;
    let hari: string;
    switch (day) {
      case 0:
        hari = 'Minggu';
        break;
      case 1:
        hari = 'Senin';
        break;
      case 2:
        hari = 'Selasa';
        break;
      case 3:
        hari = 'Rabu';
        break;
      case 4:
        hari = 'Kamis';
        break;
      case 5:
        hari = 'Jumat';
        break;
      case 6:
        hari = 'Sabtu';
        break;
      default:
        break;
    }

    switch (month) {
      case 0:
        bulan = 'Januari';
        break;
      case 1:
        bulan = 'Februari';
        break;
      case 2:
        bulan = 'Maret';
        break;
      case 3:
        bulan = 'April';
        break;
      case 4:
        bulan = 'Mei';
        break;
      case 5:
        bulan = 'Juni';
        break;
      case 6:
        bulan = 'Juli';
        break;
      case 7:
        bulan = 'Agustus';
        break;
      case 8:
        bulan = 'September';
        break;
      case 9:
        bulan = 'Oktober';
        break;
      case 10:
        bulan = 'November';
        break;
      case 11:
        bulan = 'Desember';
        break;
    }
    if (options?.withYear) {
      return `${year}`;
    }
    if (options?.withMonth) {
      return `${bulan}`;
    }
    if (options?.withDay) {
      return `${hari}`;
    }
    if (options?.withDate) {
      return `${tanggal}`;
    }
    return `${tanggal} ${bulan} ${year}`;
  }

  static getTransactionItemByCode(code: string): string {
    let result = '';
    switch (code) {
      case '001':
        result = '001_ADM PERUBAHAN';
        break;
      case '002':
        result = 'beaMaterai';
        break;
      case '003':
        result = '003_PPJ';
        break;
      case '005':
        result = '005_MATERIAL KWH MTR 1 PH';
        break;
      case '006':
        result = '006_RAB';
        break;
      case '008':
        result = '008_PFK';
        break;
      case '011':
        result = '011_MATERIAL PEMBATAS ARUS';
        break;
      case '012':
        result = '012_MATERIAL SEGEL KWH METER';
        break;
      case '013':
        result = '013_MATERIAL SEGEL PEMBATAS';
        break;
      case '014':
        result = '014_MATERIAL HANTARAN DALAM';
        break;
      case '015':
        result = '015_MATERIAL HANTARAN LUAR';
        break;
      case '016':
        result = '016_GESER KWH METER 1PH';
        break;
      case '017':
        result = '017_GESER KWH METER 3PH';
        break;
      case '018':
        result = '018_GESER TIANG TR';
        break;
      case '019':
        result = '019_GESER TIANG TM';
        break;
      case '023':
        result = '023_ADM BONGKAR PASANG';
        break;
      case '024':
        result = 'adminFee';
        break;
      case '025':
        result = '025_TS/GR P2TL-DAYA (BEBAN)';
        break;
      case '026':
        result = '026_TS/GR P2TL-ENERGI (KWH)';
        break;
      case '027':
        result = '027_KWH PESTA';
        break;
      case '029':
        result = '029_BEBAN';
        break;
      case '030':
        result = '030_KWH 1';
        break;
      case '031':
        result = '031_KWH 2';
        break;
      case '032':
        result = '032_KVARH';
        break;
      case '034':
        result = '034_ADMINISTRASI P2TL';
        break;
      case '035':
        result = '035_PERIKSA APP (S1,S2,R1,I1)';
        break;
      case '036':
        result = '036_GESER  TIANG ATAP';
        break;
      case '037':
        result = '037_PMM / PTL PRR';
        break;
      case '038':
        result = '038_DIMUKA REKENING LISTRIK';
        break;
      case '039':
        result = '039_MATERIAL BESI/PPN LNDS';
        break;
      case '041':
        result = '041_PIUTANG MATERAI';
        break;
      case '042':
        result = '042_PPN';
        break;
      case '043':
        result = '043_PIUTANG PPJ';
        break;
      case '044':
        result = '044_MATERIAL KWH METER 3PH';
        break;
      case '048':
        result = '048_PERIKSAAPP(B3,S3,I3,I4,P2)';
        break;
      case '050':
        result = '050_KWH 3';
        break;
      case '054':
        result = '054_ADM PERUBAHAN DAYA';
        break;
      case '082':
        result = '082_PEMKWH/SEWA TRAFO/KAP PRR';
        break;
      case '100':
        result = 'token';
        break;
      case '300':
        result = 'bp';
        break;
      case '400':
        result = 'ujl';
        break;
      case '535':
        result = '535_BIAYA PIUTANG CICILAN UJL';
        break;
      case '530':
        result = '530_PELUNASAN PIUTANG TAGSUS';
        break;
      case '531':
        result = '531_RPBEBAN P2TL';
        break;
      case '532':
        result = '532_RPPEMAKAIAN P2TL';
        break;
      case '534':
        result = '534_RPKWH BONGKAR';
        break;
      case '601':
        result = '601_PRR BELUM DIHAPUS';
        break;
      case '602':
        result = '602_PIUTANG PPJ';
        break;
      case '603':
        result = '603_PIUTANG METERAI';
        break;
      case '604':
        result = '604_PIUTANG PPN';
        break;
      case '605':
        result = '605_PRR SUDAH DIHAPUS';
        break;
      case '606':
        result = '606_RAB PESTA';
        break;
      case '607':
        result = '607_PTL PRA BAYAR';
        break;
      case '800':
        result = '800_RPOPERASIONAL PESTA';
        break;
      default:
        result = 'LAIN LAIN';
        break;
    }
    return result;
  }

  static getArrayAsChunks = (array, chunkSize) => {
    const result = [];
    const data = array.slice(0);
    while (data[0]) {
      result.push(data.splice(0, chunkSize));
    }
    return result;
  };
}
