FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package.json /app/yarn.lock ./
RUN yarn install --production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000 3020
CMD ["yarn", "start"]
