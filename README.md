
# Frontend companies management services


![Ouachani Logo](/img/logo.png) 


## Goal

This demo uses Quarkus, mongodb panache (more details : https://quarkus.io/guides/mongodb-panache), knative and kogito in openshift to :
- build and and deploy using S2I API company management services to add/update/remove a company
- build a serverless (using knative) credit notation for company 
- build and deploy the service using openshift S2I 

## Prerequesties 
Install :
- access to openshift
- oc client
- odo client
- follow the instruction on https://github.com/mouachan/companies-svc to build the companies management API services
- follow the instruction on https://github.com/mouachan/companies-notation-svc to build a knative decision services

## Create a registry secret (if it does not exist)

```
oc create secret docker-registry quay-secret \
    --docker-server=quay.io/mouachan \
    --docker-username= \
    --docker-password=
oc secrets link builder quay-secret
oc secrets link default quay-secret --for=pull
```

## Clone the source from github (if you want to modify sources....)
```
git clone https://github.com/mouachan/companies-mgmt-frontend

```

## Build the image on OpenShift

```
oc new-app quay.io/quarkus/ubi-quarkus-native-s2i:19.3.1-java11~https://github.com/mouachan/companies-svc.git --name=companies-mgmt-frontend 

```

## Search a company

![Search company](/img/search-company.png) 

## Calculate a credit decision

![Calculate a credit decision (note)](/img/notation.png) 

