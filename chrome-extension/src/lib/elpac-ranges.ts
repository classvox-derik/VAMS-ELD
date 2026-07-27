export type Grade = 'K' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';

interface ScoreRange {
  level1: [number, number];
  level2: [number, number];
  level3: [number, number];
  level4: [number, number];
}

export const ELPAC_RANGES: Record<string, ScoreRange> = {
  'K': { level1: [1150, 1373], level2: [1374, 1421], level3: [1422, 1473], level4: [1474, 1700] },
  '1': { level1: [1150, 1410], level2: [1411, 1454], level3: [1455, 1506], level4: [1507, 1700] },
  '2': { level1: [1150, 1423], level2: [1424, 1470], level3: [1471, 1531], level4: [1532, 1700] },
  '3': { level1: [1150, 1447], level2: [1448, 1487], level3: [1488, 1534], level4: [1535, 1800] },
  '4': { level1: [1150, 1458], level2: [1459, 1498], level3: [1499, 1548], level4: [1549, 1800] },
  '5': { level1: [1150, 1466], level2: [1467, 1513], level3: [1514, 1559], level4: [1560, 1800] },
  '6': { level1: [1150, 1474], level2: [1475, 1516], level3: [1517, 1566], level4: [1567, 1900] },
  '7': { level1: [1150, 1480], level2: [1481, 1526], level3: [1527, 1575], level4: [1576, 1900] },
  '8': { level1: [1150, 1485], level2: [1486, 1533], level3: [1534, 1589], level4: [1590, 1900] },
  '9': { level1: [1150, 1492], level2: [1493, 1544], level3: [1545, 1605], level4: [1606, 1950] },
  '10': { level1: [1150, 1492], level2: [1493, 1544], level3: [1545, 1605], level4: [1606, 1950] },
  '11': { level1: [1150, 1499], level2: [1500, 1554], level3: [1555, 1614], level4: [1615, 1950] },
  '12': { level1: [1150, 1499], level2: [1500, 1554], level3: [1555, 1614], level4: [1615, 1950] },
};

export function getElpacLevel(grade: string | number, score: number | null | undefined): number | null {
  if (score == null) return null;
  
  const g = String(grade).toUpperCase();
  const ranges = ELPAC_RANGES[g];
  
  if (!ranges) return null;

  if (score >= ranges.level4[0]) return 4;
  if (score >= ranges.level3[0]) return 3;
  if (score >= ranges.level2[0]) return 2;
  if (score >= ranges.level1[0]) return 1;
  
  return null;
}
