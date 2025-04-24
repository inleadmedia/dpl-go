describe("Login / Logout Tests", () => {
  beforeEach(() => {
    cy.visit("/search")
  })

  it("Should open login modal", () => {
    // Click profile button
    cy.dataCy("profile-button").click()

    // Check if login modal is open and visible
    cy.dataCy("global-sheet").should("exist").should("be.visible")

    // Check if login sheet has two login buttons
    cy.dataCy("global-sheet").find("button").filter(":contains('LOG IND')").should("have.length", 2)

    // Check if login sheet has close button
    cy.dataCy("global-sheet").find("button").filter(":contains('Luk')").should("exist")

    // Check if login sheet has title
    cy.dataCy("global-sheet").find("h2").contains("Log ind").should("exist")

    // Close login modal
    cy.dataCy("global-sheet").find("button").filter(":contains('Luk')").click()

    // Check if login modal is closed
    cy.dataCy("global-sheet").should("not.exist")
  })

  it("Should open unilogin page", () => {
    // Click profile button
    cy.dataCy("profile-button").click()

    // Click UNI•Login button
    cy.dataCy("global-sheet").find("button").filter(":contains('LOG IND')").first().click()
  })
})
