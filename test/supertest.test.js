import chai from "chai"
import supertest from "supertest"

const expect = chai.expect
const requester = supertest("http://localhost:8080")

describe('Testing 11vo desafio', () => {
    describe("Test de products", () => {
        it(`El endpoint GET "/api/products" debe retornar todos los productos correctamente`, async () => {
            const { statusCode, ok, _body } = await requester.get('/api/products')
            expect(statusCode).to.equal(200)
            // importante: este endpoint en mi proyecto retorna un res.render a una pagina de hbs, por esto, no retorna un payload.
        })

        it(`El endpoint GET "/api/products/:pid" debe retornar solo un producto`, async () => {
            const productToGetId = "6592d7d46cd6b55761d30601"
            const { statusCode, ok, _body } = await requester.get(`/api/products/${productToGetId}`)
            expect(statusCode).to.equal(200)
            expect(_body.payload).to.have.property("_id").to.equal(productToGetId)
        })

        it(`El endpoint POST "/api/products/" debe postear un nuevo producto correctamente`, async () => {
            const productMock = {
                nombre: "nuevoProducto",
                descripcion: "nuevoProductoDescripcion",
                category: "nuevoProductoCategoria",
                precio: 999,
                stock: 2
            }
            const { statusCode, ok, _body } = await requester.post(`/api/products`).send(productMock)
            expect(statusCode).to.equal(200)
            expect(_body.payload).to.have.property('_id')
        })
        it(`El endpoint PUT "/api/products/:pid" debe actualizar un producto correctamente`, async () => {
            const productMockToUpdate = {
                nombre: "productoReemplazado",
                descripcion: "descripcionReemplazada",
                category: "categoriaReemplazada",
                precio: 1,
                stock: 1
            }
            const productoExistenteId = "65a701e722d94c4b806828c9"
            const { statusCode, ok, _body } = await requester.put(`/api/products/${productoExistenteId}`).send(productMockToUpdate)
            expect(statusCode).to.equal(200)
            expect(_body.payload).to.have.property('acknowledged')
        })
        it(`El endpoint DELETE "/api/products/:pid" debe eliminar un producto correctamente`, async () => {
            const productoAEliminarId = "65a7020a47b61744a52c9e0c"
            const { statusCode, ok, _body } = await requester.delete(`/api/products/${productoAEliminarId}`)
            expect(statusCode).to.equal(200)
            expect(_body.payload).to.have.property('acknowledged')
        })
    }),

        describe("Test de carts", () => {
            it(`El endpoint GET "/api/carts" debe retornar todos los carts correctamente`, async () => {
                const { statusCode, ok, _body } = await requester.get('/api/carts')
                expect(statusCode).to.equal(200)
                expect(_body).to.have.property("payload")
                expect(_body.payload).to.be.an("array")
            })
            it(`El endpoint POST "/api/carts/" debe postear un nuevo cart vacio correctamente`, async () => {
                const { statusCode, ok, _body } = await requester.post(`/api/carts`)
                expect(statusCode).to.equal(200)
                expect(_body.payload).to.have.property('_id')
            })
            it(`El endpoint PUT "/api/carts/:cid" edito un cart pasado por parametro correctamente`, async () => {
                const cartToUpdateId = "656b4da053e94ad12d7f9609"
                const { statusCode, ok, _body } = await requester.put(`/api/carts/${cartToUpdateId}`)
                expect(statusCode).to.equal(200)
                expect(_body.payload).to.have.property('_id')
            })

            it(`El endpoint DELETE "/api/carts/:cid/" elimina todos los productos de un cart`, async () => {
                const cartToClearId = "656d323741169eb601d776b5"
                const { statusCode, ok, _body } = await requester.delete(`/api/carts/${cartToClearId}`)
                expect(statusCode).to.equal(200)
            })

            it(`El endpoint POST "/api/carts/:cid/purchase" finaliza el proceso de compra de un carrito y envia un mensaje con el monto`, async () => {
                const cartToPuchaseId = "656b4da053e94ad12d7f9609"
                const { statusCode, ok, _body } = await requester.post(`/api/carts/${cartToPuchaseId}/purchase`)
                expect(statusCode).to.equal(200)
                expect(_body).to.have.property("message")
            })
        })
    describe("Test de sessions", () => {
        let cookie;
        it("Debe logear correctamente a un usuario y devolver una Cookie", async () => {
            const mockUser = {
                email: "prueba1@gmail.com",
                password: "prueba1"
            }

            const result = await requester.post("/api/users/login").send(mockUser)
            const cookieResult = result.headers["set-cookie"][0]
            expect(cookieResult).to.be.ok;
            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            }
            expect(cookie.name).to.be.ok.and.eq("token")
            expect(cookie.value).to.be.ok
        })

        it("Debe enviar la cookie y desestrucurla", async () => {
            const { _body } = await requester.get("/api/sessions/current").set("Cookie", [`${cookie.name}=${cookie.value}`])
            expect(_body.payload.email).to.be.eql("prueba1@gmail.com")
        })
    })
})