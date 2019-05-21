# Skill Dialog Management

This template is a French  Skill to demonstrate the usage of Dialog Management and ways to delegate the Dialog to Alexa.

There are four components to the dialog model:

* *Required slots and prompts*: 

A required slot represents information that your skill must have in order to fulfill the user's request. You can control the order in which Alexa asks for the slot values.

* *Slot confirmation prompts* 

You can optionally designate a required slot as requiring confirmation. This means that the user must also confirm the slot value with a yes/no response before proceeding.

* *Intent confirmation prompts*

You can specify that the entire intent requires confirmation. This is common for skills that order products or make reservations. A confirmation prompt typically repeats back to the user all the information previously provided for the user to confirm. 

* *Slot validation rules and prompts* 

You can configure a set of validation rules that the slot value provided by the user must pass to be considered valid. If the value fails validation, Alexa can use your prompts to ask for a corrected value. You can use slot validation rules with both required and non-required slots.

The dialog model also includes flags indicating whether to automatically delegate the dialog to Alexa. This lets Alexa use these prompts to collect all the required information from the user before sending your skill the request.

## Automatically Delegate the Dialog to Alexa

You will use the Auto-Delegation Interface to
let Alexa automatically determine and complete each step of the dialog, based on your dialog model. Your skill gets a single IntentRequest when the dialog is complete.
It will be applied on a intent to find a travel which requires, at a minimum, the starting city (origin), destination city (destination), and date (date) to save trip details to a list.

## Combine delegation and manual control to handle complex dialogs

A skill for ordering drinks from a coffee shop has an OrderIntent intent with several slots to collect information about the type of drink the user wants to order. The drink slot is configured with slot validation to ensure that the drink the user orders is on the menu.

## Instructions

You can follow this step-by-step guide to build this template : 
[Start your Dialog Skill](./instructions/01-frontend.md)