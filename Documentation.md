# IE support + add the following in polyfill.ts

1) Fix for error with matches
Error: Object doesn't support property or method 'matches'

if (!Element.prototype.matches) {
    Element.prototype.matches = (<any>Element.prototype).msMatchesSelector || Element.prototype.webkitMatchesSelector;
}
Credit: https://stackoverflow.com/questions/46715190/error-in-ie-11-browser-exception-object-doesnt-support-property-or-method-m

2) Fix issue with Zones
Error: Can't execute code from a freed script 
(window as any).__Zone_enable_cross_context_check = true;