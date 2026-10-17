const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require("./helper")

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('/api/users', {
        data: {
            name: 'root root',
            username: 'root',
            password: 'password'
        }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {

    const locator = page.getByText("Login to application")
    await expect(locator).toBeVisible()
    await expect(page.getByLabel("username")).toBeVisible()
    await expect(page.getByLabel("password")).toBeVisible()
    await expect(page.getByRole("button", {name: "login"})).toBeVisible()
  })

  describe("Login", () => {
    test("succeeds with correct credentials", async ({page}) => {
        await loginWith(page, "mluukkai", "salainen")

        await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible()
    })

    test("fails with wrong credentials", async ({page}) => {
        await loginWith(page, "mluukkai", "sala")

        const errorDiv = page.locator(".errorMessage")
        await expect(errorDiv).toContainText("wrong credentials")
    })
  })

  describe("When logged in", () => {
    beforeEach(async ({page}) => {
        await loginWith(page, "mluukkai", "salainen")
        await page.getByRole("button", {name: "login"}).click()
    })

    test("a new blog can be created", async ({page}) => {

        await page.getByRole("button", {name: "create new blog"}).click()
        await createBlog(page, "Blog title", "Blog author", "blogurl.com")
        await page.getByRole("button", {name: "create"}).click()

        await expect(page.getByText("Blog title Blog author")).toBeVisible()
    })

    test("blog can be liked", async ({page}) => {

        await page.getByRole("button", {name: "create new blog"}).click()
        await createBlog(page, "Blog title", "Blog author", "blogurl.com")
        await expect(page.getByText("Blog title Blog author")).toBeVisible()
        
        await page.getByRole("button", {name: "show"}).click()
        await expect(page.getByText("0")).toBeVisible()
        await page.getByRole("button", {name: "like"}).click()

        await expect(page.getByText("1")).toBeVisible()
    })

    test("blog can be deleted", async ({page}) => {

        await page.getByRole("button", {name: "create new blog"}).click()
        await createBlog(page, "Blog title", "Blog author", "blogurl.com")
        await expect(page.getByText("Blog title Blog author")).toBeVisible()

        await page.getByRole("button", {name: "show"}).click()

        page.on("dialog", async dialog => {
            expect(dialog.message()).toBe("Remove blog Blog title by Blog author")
            await dialog.accept()
        })
        await page.getByRole("button", {name: "delete"}).click()

        await expect(page.getByText("Blog title Blog author")).toHaveCount(0)
    })

    test("only user that added blog can see to delete button", async ({page}) => {

        await page.getByRole("button", {name: "create new blog"}).click()
        await createBlog(page, "Blog title", "Blog author", "blogurl.com")
        await expect(page.getByText("Blog title Blog author")).toBeVisible()

        await page.getByRole("button", {name: "logout"}).click()

        await loginWith(page, "root", "password")

        await expect(page.getByText("Blog title Blog author")).toBeVisible()
        await page.getByRole("button", {name: "show"}).click()
        await expect(page.getByRole("button", {name: "delete"})).toHaveCount(0)
    })
  })

  describe("When added multiple blogs", () => {
    beforeEach(async ({page}) => {
        await loginWith(page, "mluukkai", "salainen")
        await page.getByRole("button", {name: "login"}).click()
    })

    test("blogs sort by number of likes in descending order", async ({page}) => {

        await page.getByRole("button", {name: "create new blog"}).click()
        await createBlog(page, "Blog1 Title", "Blog1 Author", "example.com")

        await page.getByRole("button", {name: "create new blog"}).click()
        await createBlog(page, "Blog2 Title", "Blog2 Author", "example.com")

        const blogs = page.getByTestId("blog")
        const blog1 = page.getByTestId("blog").filter({hasText: "Blog1 Title Blog1 Author"})
        const blog2 = page.getByTestId("blog").filter({hasText: "Blog2 Title Blog2 Author"})

        await expect(page.getByText("Blog1 Title Blog1 Author")).toBeVisible()
        await blog1.getByRole("button", {name: "show"}).click()
        await blog1.getByRole("button", {name: "like"}).click()
        await expect(blog1.getByText("1")).toBeVisible()
        
        await expect(page.getByText("Blog2 Title Blog2 Author")).toBeVisible()
        await blog2.getByRole("button", {name: "show"}).click()
        await blog2.getByRole("button", {name: "like"}).click()
        await expect(blog2.getByText("1")).toBeVisible()
        await blog2.getByRole("button", {name: "like"}).click()
        await expect(blog2.getByText("2")).toBeVisible()

        await expect(blogs.first()).toContainText("Blog2 Title Blog2 Author")
    })
  })
})
