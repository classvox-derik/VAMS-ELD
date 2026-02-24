import { createClient } from "@/lib/supabase-server";
import type { ELLevel } from "@/types";

function overallToELLevel(level: number): ELLevel {
  if (level === 1) return "Emerging";
  if (level <= 3) return "Expanding";
  return "Bridging";
}

interface StudentSeed {
  ssid: string;
  first_name: string;
  last_name: string;
  homeroom: string;
  overall: number;
  oral: number;
  written: number;
}

// 5th Grade — 32 students
const grade5: StudentSeed[] = [
  { ssid: "7726495983", first_name: "Jacob", last_name: "Amezcua", homeroom: "USC", overall: 3, oral: 2, written: 2 },
  { ssid: "3934420229", first_name: "Destiny", last_name: "Arana Vazquez", homeroom: "UCLA", overall: 3, oral: 2, written: 2 },
  { ssid: "7069462874", first_name: "David", last_name: "Barco", homeroom: "LMU", overall: 3, oral: 3, written: 2 },
  { ssid: "6294172285", first_name: "Jaime", last_name: "Cano Silva", homeroom: "UCLA", overall: 3, oral: 3, written: 2 },
  { ssid: "2074202807", first_name: "Alexis", last_name: "Cerna Velasquez", homeroom: "UCLA", overall: 2, oral: 2, written: 2 },
  { ssid: "3273149294", first_name: "Mia", last_name: "De La Cruz", homeroom: "CSUN", overall: 3, oral: 2, written: 2 },
  { ssid: "9919493998", first_name: "Bryana", last_name: "Del Cid", homeroom: "LMU", overall: 3, oral: 2, written: 1 },
  { ssid: "3197699234", first_name: "Oscar", last_name: "Duque Gonzalez", homeroom: "USC", overall: 2, oral: 2, written: 2 },
  { ssid: "3492307743", first_name: "Aubrey", last_name: "Escobedo Estrada", homeroom: "CSUN", overall: 3, oral: 2, written: 2 },
  { ssid: "7093566077", first_name: "Fernanda", last_name: "Fuentes", homeroom: "CSUN", overall: 3, oral: 2, written: 2 },
  { ssid: "2185913261", first_name: "Sofia", last_name: "Fuentes Martinez", homeroom: "LMU", overall: 2, oral: 2, written: 1 },
  { ssid: "9051329395", first_name: "Sarah", last_name: "Guevara Flores", homeroom: "USC", overall: 2, oral: 2, written: 1 },
  { ssid: "2536649076", first_name: "Adriana", last_name: "Hernandez", homeroom: "USC", overall: 2, oral: 2, written: 1 },
  { ssid: "7076749037", first_name: "Gael", last_name: "Hernandez Chavez", homeroom: "CSUN", overall: 2, oral: 2, written: 1 },
  { ssid: "8722926325", first_name: "Ayleen", last_name: "Huerta Hernandez", homeroom: "UCLA", overall: 2, oral: 3, written: 2 },
  { ssid: "4713951453", first_name: "Robert", last_name: "Jimenez", homeroom: "LMU", overall: 1, oral: 1, written: 1 },
  { ssid: "7431813123", first_name: "Ariana", last_name: "Jimenez", homeroom: "USC", overall: 1, oral: 2, written: 1 },
  { ssid: "8497622801", first_name: "Mariana Sofia", last_name: "Leal Hernandez", homeroom: "LMU", overall: 1, oral: 1, written: 1 },
  { ssid: "8787288262", first_name: "Diego", last_name: "Martinez", homeroom: "LMU", overall: 3, oral: 3, written: 2 },
  { ssid: "7634928982", first_name: "Nicolle", last_name: "Mejia", homeroom: "USC", overall: 3, oral: 3, written: 2 },
  { ssid: "4582894274", first_name: "Stephanie", last_name: "Melendez", homeroom: "CSUN", overall: 3, oral: 3, written: 2 },
  { ssid: "3345067732", first_name: "Pablo", last_name: "Morales", homeroom: "LMU", overall: 3, oral: 3, written: 2 },
  { ssid: "7425244225", first_name: "Bella", last_name: "Pacheco", homeroom: "UCLA", overall: 3, oral: 3, written: 2 },
  { ssid: "7431251264", first_name: "Victor", last_name: "Prudencio", homeroom: "CSUN", overall: 2, oral: 2, written: 2 },
  { ssid: "2552928478", first_name: "Dylan", last_name: "Ramirez Martinez", homeroom: "USC", overall: 4, oral: 3, written: 2 },
  { ssid: "5963573744", first_name: "Alexander", last_name: "Reyes Luna", homeroom: "CSUN", overall: 3, oral: 3, written: 2 },
  { ssid: "5911884540", first_name: "Neymar", last_name: "Sacayon Gonzalez", homeroom: "USC", overall: 3, oral: 3, written: 1 },
  { ssid: "6846608430", first_name: "Cristina", last_name: "Segovia", homeroom: "LMU", overall: 1, oral: 2, written: 2 },
  { ssid: "3234782406", first_name: "Sofia", last_name: "Valles Jaco", homeroom: "LMU", overall: 1, oral: 1, written: 1 },
  { ssid: "4547883745", first_name: "Nicole", last_name: "Vasquez", homeroom: "UCLA", overall: 3, oral: 3, written: 2 },
  { ssid: "1787343401", first_name: "Jacob", last_name: "Villalobos", homeroom: "LMU", overall: 3, oral: 3, written: 2 },
];

// 6th Grade — 28 students
const grade6: StudentSeed[] = [
  { ssid: "1249979449", first_name: "Caleb", last_name: "Aguilar Chavez", homeroom: "CSUN", overall: 3, oral: 4, written: 2 },
  { ssid: "3679284778", first_name: "Melvin", last_name: "Aguilar Chavez", homeroom: "LMU", overall: 4, oral: 4, written: 3 },
  { ssid: "2323319883", first_name: "Leonardo", last_name: "Alvarez", homeroom: "USC", overall: 3, oral: 4, written: 2 },
  { ssid: "6052440521", first_name: "Allyson", last_name: "Arzeta-Sotelo", homeroom: "CSUN", overall: 4, oral: 4, written: 3 },
  { ssid: "6632210362", first_name: "Jocelyn", last_name: "Ayala Pulido", homeroom: "USC", overall: 3, oral: 4, written: 2 },
  { ssid: "7127783965", first_name: "Victor", last_name: "Bautista", homeroom: "CSUN", overall: 4, oral: 4, written: 3 },
  { ssid: "1095350174", first_name: "Mateo", last_name: "Carballo", homeroom: "USC", overall: 3, oral: 4, written: 2 },
  { ssid: "1136498005", first_name: "Elijah", last_name: "Cervantes Tellez", homeroom: "LMU", overall: 3, oral: 4, written: 2 },
  { ssid: "9612585538", first_name: "Pedro", last_name: "Cifuentes Miranda", homeroom: "USC", overall: 2, oral: 3, written: 2 },
  { ssid: "9036841285", first_name: "Nathalie", last_name: "Cruz", homeroom: "UCLA", overall: 3, oral: 4, written: 2 },
  { ssid: "4392299441", first_name: "Livana", last_name: "Cruz Sandoval", homeroom: "UCLA", overall: 1, oral: 2, written: 1 },
  { ssid: "5013003374", first_name: "Cristina", last_name: "De La Torre Garcia", homeroom: "LMU", overall: 3, oral: 4, written: 2 },
  { ssid: "8198384940", first_name: "Isaias", last_name: "Gomez", homeroom: "CSUN", overall: 4, oral: 4, written: 2 },
  { ssid: "7577282880", first_name: "Sergio", last_name: "Gonzalez De La Cruz", homeroom: "LMU", overall: 3, oral: 4, written: 2 },
  { ssid: "5978094974", first_name: "Clesmin", last_name: "Gonzalez Villatoro", homeroom: "UCLA", overall: 1, oral: 1, written: 1 },
  { ssid: "4163953138", first_name: "Harold", last_name: "Hernandez", homeroom: "LMU", overall: 4, oral: 4, written: 3 },
  { ssid: "9761859246", first_name: "Yeshaya", last_name: "Martinez Amaya", homeroom: "UCLA", overall: 2, oral: 4, written: 1 },
  { ssid: "5406960587", first_name: "Genesis", last_name: "Martinez Enriquez", homeroom: "UCLA", overall: 2, oral: 3, written: 1 },
  { ssid: "7676632056", first_name: "John", last_name: "Molina Perez", homeroom: "LMU", overall: 4, oral: 4, written: 4 },
  { ssid: "7736305882", first_name: "Kimberly", last_name: "Ordonez Hernandez", homeroom: "USC", overall: 3, oral: 4, written: 2 },
  { ssid: "8075985118", first_name: "Elizabeth", last_name: "Ramirez", homeroom: "CSUN", overall: 4, oral: 4, written: 3 },
  { ssid: "4807640790", first_name: "Melanie", last_name: "Rivera Godines", homeroom: "LMU", overall: 2, oral: 3, written: 2 },
  { ssid: "3757008205", first_name: "Logan", last_name: "Rodriguez Ponciano", homeroom: "LMU", overall: 3, oral: 3, written: 2 },
  { ssid: "7009683028", first_name: "Shadani", last_name: "Sandoval Reyes", homeroom: "USC", overall: 3, oral: 4, written: 2 },
  { ssid: "2967720805", first_name: "Jeffrey", last_name: "Soc Duarte", homeroom: "USC", overall: 3, oral: 3, written: 3 },
  { ssid: "3811658556", first_name: "Martin", last_name: "Suarez Angulo", homeroom: "CSUN", overall: 2, oral: 3, written: 2 },
  { ssid: "2235872610", first_name: "Gilmer", last_name: "Zabala Ramos", homeroom: "USC", overall: 2, oral: 3, written: 1 },
  { ssid: "2563756547", first_name: "Jason", last_name: "Zepeda", homeroom: "USC", overall: 3, oral: 3, written: 2 },
];

// 7th Grade — 26 students
const grade7: StudentSeed[] = [
  { ssid: "8194424455", first_name: "Ana", last_name: "Alvarado De Rosas", homeroom: "LMU", overall: 2, oral: 3, written: 1 },
  { ssid: "5907682978", first_name: "Jacob", last_name: "Armas-Sanchez", homeroom: "UCLA", overall: 3, oral: 4, written: 3 },
  { ssid: "4294421245", first_name: "Isaac", last_name: "Arroyo", homeroom: "UCLA", overall: 3, oral: 4, written: 2 },
  { ssid: "6672097890", first_name: "Nathanael", last_name: "Baez", homeroom: "CSUN", overall: 2, oral: 2, written: 2 },
  { ssid: "1771360288", first_name: "Belen", last_name: "Barbosa", homeroom: "UCLA", overall: 3, oral: 4, written: 2 },
  { ssid: "1270083047", first_name: "Steven", last_name: "Campos Vasquez", homeroom: "CSUN", overall: 2, oral: 3, written: 2 },
  { ssid: "1332748440", first_name: "Jose", last_name: "Carrillo", homeroom: "USC", overall: 4, oral: 3, written: 4 },
  { ssid: "5204173004", first_name: "Liliana", last_name: "Casiano Lopez", homeroom: "CSUN", overall: 3, oral: 3, written: 2 },
  { ssid: "2970858598", first_name: "Eric", last_name: "Clemente", homeroom: "UCLA", overall: 3, oral: 4, written: 2 },
  { ssid: "5187430889", first_name: "Cristy", last_name: "Gallegos Nieto", homeroom: "LMU", overall: 3, oral: 4, written: 2 },
  { ssid: "3244119243", first_name: "Matthew", last_name: "Garcia", homeroom: "LMU", overall: 2, oral: 3, written: 2 },
  { ssid: "7540122418", first_name: "Jose", last_name: "Gerardo Martinez", homeroom: "USC", overall: 1, oral: 3, written: 1 },
  { ssid: "5532005463", first_name: "Ariana", last_name: "Guerrero Murcia", homeroom: "UCLA", overall: 3, oral: 3, written: 2 },
  { ssid: "4370317626", first_name: "Neymar", last_name: "Gutierrez-Garcia", homeroom: "USC", overall: 2, oral: 3, written: 1 },
  { ssid: "8631256173", first_name: "Jesus", last_name: "Martinez Gomez", homeroom: "LMU", overall: 3, oral: 4, written: 2 },
  { ssid: "4345510410", first_name: "Michael", last_name: "Martinez-Rojas", homeroom: "CSUN", overall: 2, oral: 3, written: 1 },
  { ssid: "6290340535", first_name: "Jacob", last_name: "Mejia", homeroom: "LMU", overall: 3, oral: 4, written: 2 },
  { ssid: "5952443837", first_name: "Larissa", last_name: "Morales", homeroom: "USC", overall: 3, oral: 4, written: 2 },
  { ssid: "2655671591", first_name: "Andrea", last_name: "Padilla", homeroom: "CSUN", overall: 3, oral: 4, written: 1 },
  { ssid: "3210835173", first_name: "Abdel", last_name: "Palma Mendoza", homeroom: "LMU", overall: 2, oral: 3, written: 2 },
  { ssid: "1335168347", first_name: "Kevin", last_name: "Prudencio", homeroom: "CSUN", overall: 3, oral: 4, written: 2 },
  { ssid: "5972565420", first_name: "Mathew", last_name: "Rivera", homeroom: "CSUN", overall: 3, oral: 4, written: 1 },
  { ssid: "3600165418", first_name: "Samantha", last_name: "Rodriguez", homeroom: "LMU", overall: 2, oral: 3, written: 2 },
  { ssid: "9537905564", first_name: "Gerson", last_name: "Sensente Manchan", homeroom: "USC", overall: 1, oral: 1, written: 1 },
  { ssid: "1627050396", first_name: "Kevin", last_name: "Zamora Machado", homeroom: "LMU", overall: 3, oral: 4, written: 3 },
];

// 8th Grade — 28 students
const grade8: StudentSeed[] = [
  { ssid: "3623626315", first_name: "David", last_name: "Alejandro", homeroom: "LMU", overall: 2, oral: 3, written: 2 },
  { ssid: "1097486550", first_name: "Alexis", last_name: "Barrios", homeroom: "USC", overall: 3, oral: 3, written: 2 },
  { ssid: "7055622134", first_name: "Axel", last_name: "Bracamontes", homeroom: "LMU", overall: 3, oral: 3, written: 3 },
  { ssid: "9402719894", first_name: "Lizbeth", last_name: "Cerda Alejo", homeroom: "UCLA", overall: 2, oral: 3, written: 2 },
  { ssid: "6731748742", first_name: "Ashley", last_name: "Gonzalez Arellano", homeroom: "UCLA", overall: 3, oral: 4, written: 2 },
  { ssid: "4681908988", first_name: "Erick", last_name: "Gonzalez Garcia", homeroom: "LMU", overall: 2, oral: 1, written: 1 },
  { ssid: "5661994656", first_name: "Sophie", last_name: "Guardado", homeroom: "CSUN", overall: 3, oral: 4, written: 2 },
  { ssid: "5125568692", first_name: "Andrea", last_name: "Gutierrez", homeroom: "CSUN", overall: 3, oral: 4, written: 3 },
  { ssid: "2247007724", first_name: "Emmalee", last_name: "Gutierrez", homeroom: "USC", overall: 2, oral: 3, written: 2 },
  { ssid: "5691914065", first_name: "Alexander", last_name: "Lopez", homeroom: "USC", overall: 3, oral: 4, written: 2 },
  { ssid: "9106674513", first_name: "Melanie", last_name: "Rivas Tecun", homeroom: "UCLA", overall: 3, oral: 3, written: 2 },
  { ssid: "2071829507", first_name: "Mariela", last_name: "Mendez Cid", homeroom: "LMU", overall: 4, oral: 4, written: 2 },
  { ssid: "8441226595", first_name: "Jaimy", last_name: "Palacios Monge", homeroom: "CSUN", overall: 3, oral: 3, written: 3 },
  { ssid: "3731567411", first_name: "Coraline", last_name: "Pineda", homeroom: "CSUN", overall: 3, oral: 3, written: 2 },
  { ssid: "5588345643", first_name: "Jonathan", last_name: "Pineda Hernandez", homeroom: "CSUN", overall: 3, oral: 3, written: 2 },
  { ssid: "8460953155", first_name: "Jessica", last_name: "Ramos", homeroom: "UCLA", overall: 2, oral: 2, written: 2 },
  { ssid: "2385987491", first_name: "Gabriel", last_name: "Romero", homeroom: "USC", overall: 3, oral: 3, written: 3 },
  { ssid: "4329473602", first_name: "Karla", last_name: "Sandoval", homeroom: "CSUN", overall: 3, oral: 3, written: 2 },
  { ssid: "6474241225", first_name: "Chelsea", last_name: "Santos Ruiz", homeroom: "USC", overall: 2, oral: 1, written: 1 },
  { ssid: "4112459627", first_name: "Daniel", last_name: "Soriano", homeroom: "LMU", overall: 3, oral: 3, written: 2 },
  { ssid: "4308451356", first_name: "Haily", last_name: "Sotarriba", homeroom: "USC", overall: 2, oral: 3, written: 2 },
  { ssid: "7932543581", first_name: "Miguel", last_name: "Trinidad", homeroom: "LMU", overall: 1, oral: 2, written: 2 },
  { ssid: "7928847450", first_name: "Rigo", last_name: "Vasquez Ambriz", homeroom: "UCLA", overall: 3, oral: 3, written: 4 },
  { ssid: "2281077437", first_name: "Angel", last_name: "Villatoro", homeroom: "UCLA", overall: 3, oral: 4, written: 3 },
];

function buildStudentRows(students: StudentSeed[], grade: number, createdBy: string) {
  return students.map((s) => ({
    ssid: s.ssid,
    name: `${s.first_name} ${s.last_name}`,
    grade,
    homeroom: s.homeroom,
    el_level: overallToELLevel(s.overall),
    overall_level: s.overall,
    oral_language_level: s.oral,
    written_language_level: s.written,
    primary_language: "Spanish",
    custom_scaffolds: [],
    created_by: createdBy,
  }));
}

export async function seedStudents(createdBy: string = "system@brightstarschools.org") {
  const supabase = createClient();

  // Check if students already exist
  const { count } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true });

  if (count && count > 0) {
    return {
      seeded: false,
      message: `Students table already has ${count} records. Skipping seed to avoid duplicates.`,
      count,
    };
  }

  const allStudents = [
    ...buildStudentRows(grade5, 5, createdBy),
    ...buildStudentRows(grade6, 6, createdBy),
    ...buildStudentRows(grade7, 7, createdBy),
    ...buildStudentRows(grade8, 8, createdBy),
  ];

  const { data, error } = await supabase
    .from("students")
    .insert(allStudents)
    .select();

  if (error) {
    throw new Error(`Failed to seed students: ${error.message}`);
  }

  return {
    seeded: true,
    message: `Successfully seeded ${data.length} students`,
    count: data.length,
    breakdown: {
      grade5: grade5.length,
      grade6: grade6.length,
      grade7: grade7.length,
      grade8: grade8.length,
    },
  };
}
