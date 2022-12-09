#!/usr/bin/env node

import chalk from 'chalk'
import inquirer from 'inquirer'
import gradient from 'gradient-string'
import chalkAnimation from 'chalk-animation'
import figlet from 'figlet'
import { createSpinner } from 'nanospinner'
import { question } from './questions.js'

let correctAnswers = 0

const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms))

async function welcome() {
  figlet(`Welcome to :`, (_, data) => {
    console.log(gradient.pastel.multiline(data) + '\n')
  });

  await sleep()

  figlet(`The Quiz !\n`, (_, data) => {
    console.log(gradient.pastel.multiline(data) + '\n')
  });

  await sleep(1000)

  console.log(`
    ${chalk.bgYellow.black(' Use arrow keys ')} 

    ${chalk.bgGreen.black(' Or Vim motions ')} 
  `);
  await sleep(2500)
}

async function handleAnswer(isCorrect) {
  const spinner = createSpinner('Loading...').start()
  await sleep()

  if (isCorrect) {
    correctAnswers++
    spinner.success({ text: `Correct!` })
  } else {
    console.log('\n❌❌❌ You are wrong!')

    figlet(`You loose!`, (_, data) => {
      console.log(gradient.morning.multiline(data) + '\n')

      console.log(
        chalk.redBright(
          `  ${correctAnswers} out of ${question.length} answers are correct`
        )
      )
      process.exit(0)
    })
    process.exit(1)
  }
}

async function winner() {
  console.clear()
  figlet(`You win!`, (_, data) => {
    console.log(gradient.pastel.multiline(data) + '\n')
  })
  await sleep()
  chalkAnimation.rainbow(`  ${correctAnswers} out of ${question.length} answers are correct`)
  await sleep(1500)
  process.exit(0)
}

async function triggerQuestions() {
  for (let i = 0; i <= question.length - 1; i++) {
    const answers = await inquirer.prompt({
      name: question[i].name,
      type: 'list',
      message: question[i].message,
      choices: question[i].choices,
    })
    handleAnswer(Object.values(answers).toString() === question[i].answer)
    await sleep()
  }
}

console.clear()
await welcome()
await triggerQuestions()
winner()
