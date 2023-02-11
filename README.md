# Job Winner


## Background

I lost my job right before the holiday season in 2022. I need to look for a new job and apply for as many as I can while all the big techs are laying off talents.

To keep track of job applications:

1. Use Google Spreadsheet (I am using it before this project). It is ugly, hard to maintain and easy to mess up the layout.
1. Use online tool like huntr.co. But it can only track 40 jobs and I don't want to spend a dime for the premium service.
1. Use pen and paper. It works but I can't copy and paste information such as link job link and utilize it later.

None of the about is fun or totally fit my use case.

That's the reason for me to build something for myself, and potentially you, to get the job one (and to get a new job successfully!)

## Benefit of Job Winner

With Job Winner, you can keep track of how many job applications you want, for free, without paying for a fee and have your personal data being sold.


## Features

Current function:
1. An Index page to list all the job applications
![index](https://github.com/januschung/job-winner/blob/main/readme-img/index.png)
1. A Create page to create new job application entry
![new](https://github.com/januschung/job-winner/blob/main/readme-img/new.png)
1. Delete a job application
1. Edit a job application

Each job application has the following fields:
1. Company Name
1. Job Title
1. Salary Range
1. Applied Date
1. Description
1. Job Link
1. Status

## Components

Job Winner has two components
1. UI (this repo)
1. [Backend](https://github.com/januschung/job-winner)

## About this repo

This is the UI for Job Winner and here is the stack:

1. React
1. Apollo Client
1. Material UI

## To build 

Please follow the build instruction from the [UI repo](https://github.com/januschung/job-winner) to bring up the backend.

```console
npm start
```
or use docker
```console
docker build -t job-winner-ui .
docker run -p 3000:3000 -d job-winner-ui
```

## This is a beta version

While it works if one just want to keep track of the job applications, it needs further development for some basic features:
1. Add interview
1. Add job offer
1. A list of interview page
1. A list of offer page
1. Unit test


## Contributing 

I would like your help and input.

I appreciate all suggestions or PRs which will help this project better. Feel free to fork the project and create a pull request with your idea.

