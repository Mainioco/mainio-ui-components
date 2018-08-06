# Mainio Forms

This project's aim is to have easily integratable Angular 6 Dynamic forms to any web application. The project's not recommended for production at this stage. The project utilizes Angular Material at this stage.

## Build status

![Build status](https://mainiocoproduction.visualstudio.com/_apis/public/build/definitions/8f3b2aa3-39a3-4734-88b5-e20e775f0672/4/badge)

## Install

Using NPM run `npm i mainio-forms`
Using Yarn run `yarn add mainio-forms`

## Features

The project's split to two parts; one for dynamic form components (such as input field), and the other functionalities.

### Functionalities

| Feature                                        | Implemented | Documented | Has Tests | Notes                                      |
| ---------------------------------------------- | ----------- | ---------- | --------- | ------------------------------------------ |
| Display logic                                  | X           |            |
| Split one form to several display components   | X           |            |           | Basic support only. Service under progress |
| Service to combine splitted forms to one value |             |            |
| Basic validators                               | X           |            |           | Min, max length of input field             |
| Advanced validators                            |             |            |           | Support for Regex for example              |
| Clean styles                                   |             |            |           | No Angular material dependencies           |
| Rxjs Store                                     |             |            |           |                                            |

### Form components

| Form component     | Implemented | Documented | Has Tests |
| ------------------ | ----------- | ---------- | --------- |
| Input field        | X           |            |           |
| Number field       | X           |            |           |
| Dropdown menu      | X           |            |
| Auto Complete      | X           |            |
| Open Text          |             |            |
| Range choice       |             |            |
| Radio button group |             |            |
