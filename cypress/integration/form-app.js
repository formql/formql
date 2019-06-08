describe('Form App testing', function() {
    it('Successfully loads', function() {
        cy.visit('http://localhost:4200') // change URL to match your dev URL
    })
    
    it('Enter firt name and last name - Pedro Garcia', function() {
        cy.get('#f3ba55e9-20b3-db67-2099-22a9108bcd47')
            .type('Pedro');

        cy.get('#0af1e87f-29fe-e6e0-80ca-f1d512b889ec')
            .type('Garcia');
        
        cy.get('#4b206429-58d0-7a41-8bfc-040cdaf81677')
            .should('have', 'Pedro Garcia')
            .should('have.attr', 'disabled');
    });

    it('Click/unclick on Add comments', function() {
        cy.get('#842329ce-9118-8865-f71e-f8f223150a1f').get('[type="checkbox"]').first().
            click({force:true});
                
        cy.get('#842329ce-9118-8865-f71e-f8f223150a1f').get('[type="checkbox"]').first().
            click({force:true});

        cy.get('[componentid=ba201941-0126-0427-4d73-f1c2677aec04]').
            parent().should('have.class', "fql-component-container-hidden");
                
    })
  })