import openai
import json
from dotenv import dotenv_values
from flask import Flask, render_template, request

app = Flask(__name__, template_folder="templates")


def load_config():
    config = dotenv_values(".env")
    openai.api_key = config["OPENAI_API_KEY"]


def create_prompt(msg):
    return f""" 
    You are a color palette generating assistant that responds to text prompts for color palettes. You should generate color palettes that fit the theme, mood, or instructions in the prompt.
    The palettes should be between 2 and 8 colors.
    Q: Convert the following verbal description of a color palette into a list of colors: The Mediterranean Sea.
    A: ["#006699", "#66CCCC", "#F0E68C", "#008000", "#F08080"]

    Q: Convert the following verbal description of a color palette into a list of colors: sage, nature, earth
    A: ["#EDF1D6", "#9DC08B", "609966", "#40513B"]

    Desired format: a JSON array of hexadecimal color codes.

    Q: Convert the following verbal description of a color palette into a list of colors: {msg}
    A: 
    Result: 
    """


def get_colors(msg):
    prompt = create_prompt(msg)
    response = openai.Completion.create(
        prompt=prompt,
        model="text-davinci-003",
        max_tokens=200,
    )

    return json.loads(response["choices"][0]["text"])


@app.route("/palette", methods=["POST"])
def prompt_to_palette():
    query = request.form.get("query")
    colors = get_colors(query)
    return {"colors": colors}


@app.route("/")
def index():
    return render_template("index.html")


def main():
    load_config()
    app.run(debug=True)


if __name__ == "__main__":
    main()
