export class GlobalConstants {
    public static apiURLPlagiarismDetection: string = "http://localhost:5000/api/v1/plagiarism/";
    public static responsibleCode: number = 1;
    public static entityCode: number = 1;
    //Umbral para determinar si una frase va en el reporte
    public static umbral: number = 30;
    public static maxSimilarity: number = 80;
    public static middleSimilarity: number = 50;
}