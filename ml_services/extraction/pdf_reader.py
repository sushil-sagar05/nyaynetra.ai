from PyPDF2 import PdfReader

def load_pdf(file_path):
    return PdfReader(file_path)