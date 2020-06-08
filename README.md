
# Frontend companies management services


![Ouachani Logo](/img/logo.png) 


## Goal

The application built on openshift use innovative technologies such Quarkus runtime, serverless Kogito decision management, mongodb Panache framework to offer :
- a rich API services to register/update/remove company in/to/from the catalog
- a search module to retreive and display the company details
- a serverless credit score calculator based on the company financial data 

To create the services :
- follow the instruction on https://github.com/mouachan/companies-svc to build the companies catalog API services
- follow the instruction on https://github.com/mouachan/companies-notation-svc to build a knative decision services

## Prerequesties 
Install :
- access to openshift
- oc client
- odo client


## Clone the source from github (if you want to modify sources....)
```
git clone https://github.com/mouachan/companies-mgmt-frontend

```
## Create a github secret (if need it)
```
echo "apiVersion: v1
data:
  password: "username"
  username: "password"
kind: Secret
metadata:
  name: github
type: kubernetes.io/basic-auth" | oc apply -f - 
```

## Build the image on OpenShift

```
oc new-app quay.io/quarkus/ubi-quarkus-native-s2i:19.3.1-java11~https://github.com/mouachan/companies-mgmt-frontend --name=companies-mgmt-frontend --source-secret=github

```
## Deployed applications on openshift developer view
![deployed applications](/img/deployed-applications.png)

## Search a company

![Search company](/img/search-company.png) 

## Calculate a credit decision

![Calculate a credit decision (note)](/img/notation.png) 

