const fs = require('mz/fs')
import { mount } from '@vue/test-utils'

import ProfileImageForm from '@/components/ForTest/ProfileImageForm.vue'
import store from '@/assets/js/file/server.js'
const event = {
  target: {
    files: [
      {
        name: 'image.png',
        size: 50000,
        type: 'image/png'
      }
    ]
  }
}

describe('Hamburger.vue', async () => {
  const filePath = `${__dirname}/testFiles/picture.jpeg`

  process.env.VUE_APP_BASE_API = 'http://localhost'

  it('picture exists', async done => {
    const exists = await fs.exists(filePath)
    if (!exists) throw new Error('file does not exist')

    fs.readFile(filePath, async function read(err, data) {
      const blob = new Blob([data])
      const file = new window.File([blob], 'picture.jpeg', {
        type: 'image/png'
      })
      file.extension = '.jpg'
      expect(file.name).toBe('picture.jpeg')
      expect(file.type).toBe('image/png')
      expect(file.extension).toBe('.jpg')
      const md5 = await store.fileMD5(file)
      const handler = await store.publicHandler()
    })
    fs.exists(filePath)
      .then(exists => {
        if (!exists) throw new Error('file does not exist')

        fs.readFile(filePath, async function read(err, data) {
          if (err) {
            done(err)
          }

          const blob = new Blob([data])
          const file = new window.File([blob], 'picture.jpeg', {
            type: 'image/png'
          })
          file.extension = '.jpg'
          expect(file.name).toBe('picture.jpeg')
          expect(file.type).toBe('image/png')
          expect(file.extension).toBe('.jpg')
          const md5 = await store.fileMD5(file)
          console.log(md5)
          const handler = await store.publicHandler()
          const has = store.fileHas(md5, file.extension, handler)
          if (has) {
            done()
          } else {
            const r = await store
              .fileUpload(md5, file.extension, file, p => {}, handler)
              .then(r => {
                console.log(r.data)

                done()
              })
              .catch(err => {
                done(err)
              })
          }
        })
      })
      .catch(err => {
        console.error(err)
        done(err)
      })
  })

  it('makes a call to persist the image on image upload', () => {
    // Mount the component
    const wrapper = mount(ProfileImageForm)

    // Mock FileReader.readAsDataURL() to be a function that returns null
    const fileReaderSpy = jest
      .spyOn(FileReader.prototype, 'readAsDataURL')
      .mockImplementation(() => null)

    // Spy on the component’s persist() method
    const persistSpy = jest.spyOn(wrapper.vm, 'persist')

    // Manually trigger the component’s onChange() method
    wrapper.vm.onChange(event)

    // Assert that the FileReader object was called with the uploaded image
    expect(fileReaderSpy).toHaveBeenCalledWith(event.target.files[0])

    // Assert that the component’s persist() method was called with the uploaded image
    expect(persistSpy).toHaveBeenCalledWith(event.target.files[0])
  })
})
