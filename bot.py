import asyncio
import json

from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart
from aiogram.types import FSInputFile

TOKEN = "8380122407:AAE580DcnsimZ0Nz9ZhvTnNLKBLE07PmZis"

bot = Bot(token=TOKEN)
dp = Dispatcher()

# ===============================
# LOAD CARDS DATA
# ===============================

with open("cards.json", encoding="utf-8") as f:
    cards = json.load(f)

CARD_NAMES = [
    "The Fool","The Magician","The High Priestess","The Empress","The Emperor",
    "The Hierophant","The Lovers","The Chariot","Strength","The Hermit",
    "Wheel of Fortune","Justice","The Hanged Man","Death",
    "Temperance","The Devil","The Tower","The Star","The Moon",
    "The Sun","Judgement","The World"
]


# ===============================
# START HANDLER
# ===============================

@dp.message(CommandStart())
async def start_handler(message: types.Message, command: CommandStart):

    payload = command.args

    # ===============================
    # SHARE CARD LINK
    # ===============================

    if payload and payload.startswith("card_"):

        card_id = int(payload.split("_")[1])

        name = CARD_NAMES[card_id]

        description = cards[card_id]["upright"]["en"]

        photo = FSInputFile(f"images/cards/{str(card_id).zfill(2)}.png")

        keyboard = types.InlineKeyboardMarkup(
            inline_keyboard=[
                [
                    types.InlineKeyboardButton(
                        text="🔮 Open Arcana",
                        web_app=types.WebAppInfo(
                            url="https://alba-x-ai.github.io/arcana-miniapp/"
                        )
                    )
                ]
            ]
        )

        await message.answer_photo(
            photo=photo,
            caption=f"🔮 {name}\n\n{description}",
            reply_markup=keyboard
        )

        return


    # ===============================
    # NORMAL START
    # ===============================

    keyboard = types.InlineKeyboardMarkup(
        inline_keyboard=[
            [
                types.InlineKeyboardButton(
                    text="🔮 Open App",
                    web_app=types.WebAppInfo(
                        url="https://alba-x-ai.github.io/arcana-miniapp/"
                    )
                )
            ]
        ]
    )

    await message.answer(
        "✨ Добро пожаловать\nОткрой приложение:",
        reply_markup=keyboard
    )


# ===============================
# RUN BOT
# ===============================

async def main():
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())