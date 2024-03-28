/**
 * The patterns are the same as the ones on the app
 */

export const passwordPattern = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?\d).{7,})\S$/

export const emailPattern = /^([\w-+]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/

export const phonePattern = /^00\d{1,4}?\d{1,3}?\d{1,4}\d{1,4}\d{1,9}$/
