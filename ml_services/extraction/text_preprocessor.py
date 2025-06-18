import re
## text Preprocessing
def text_preprocessing(pdf):
    full_text = ""
    for i in range(len(pdf.pages)):
        text=pdf.pages[i].extract_text()
        lines = text.split('\n')
        cleaned_text = '\n'.join(lines[1:])
        cleaned_text=cleaned_text.replace('\n\n', ' ').replace('\n', ' ')
        pattern = re.compile(r'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)')
        cleaned=pattern.sub(r'',cleaned_text)
        full_text += cleaned+" "
    return full_text
